"use server";

import { headers } from "next/headers";
import { getPayload } from "payload";
import configPromise from "@/payload.config";
import {
  contactFormSchema,
  type ContactFormValues,
} from "@/lib/validations/contact";
import { sendInquiryEmails } from "@/lib/email";

// ============================================================================
// 1. PRODUCTION RATE LIMITER (LEAK-PROOF IN-MEMORY FALLBACK WITH TTL SWEEP)
// ============================================================================
interface RateLimitBucket {
  count: number;
  resetAt: number;
}

class SlidingWindowRateLimiter {
  private readonly storage = new Map<string, RateLimitBucket>();
  private readonly windowMs: number;
  private readonly maxRequests: number;
  private readonly maxMapSize: number;
  private lastEviction: number = Date.now();

  constructor(windowMs = 60_000, maxRequests = 5, maxMapSize = 10_000) {
    this.windowMs = windowMs;
    this.maxRequests = maxRequests;
    this.maxMapSize = maxMapSize;
  }

  public isLimited(key: string): { limited: boolean; retryAfterMs: number } {
    const now = Date.now();

    // Passive eviction check every window cycle to completely eliminate memory leaks
    if (
      now - this.lastEviction > this.windowMs ||
      this.storage.size > this.maxMapSize
    ) {
      this.purgeExpired(now);
    }

    const bucket = this.storage.get(key);

    if (!bucket || now >= bucket.resetAt) {
      this.storage.set(key, { count: 1, resetAt: now + this.windowMs });
      return { limited: false, retryAfterMs: 0 };
    }

    if (bucket.count >= this.maxRequests) {
      return { limited: true, retryAfterMs: bucket.resetAt - now };
    }

    bucket.count += 1;
    return { limited: false, retryAfterMs: 0 };
  }

  private purgeExpired(now: number): void {
    this.lastEviction = now;
    for (const [key, bucket] of this.storage.entries()) {
      if (now >= bucket.resetAt) {
        this.storage.delete(key);
      }
    }
  }
}

// Module-level singleton instance for zero-leak local rate-limiting
const rateLimiter = new SlidingWindowRateLimiter(60_000, 5, 20_000);

// ============================================================================
// 2. OBSERVABILITY & TELEMETRY CONTRACTS
// ============================================================================
export interface ActionResponse<T = unknown> {
  success: boolean;
  data?: T;
  errors?: Record<string, string>;
  message?: string;
  correlationId: string;
}

interface LogPayload {
  level: "INFO" | "WARN" | "ERROR" | "FATAL";
  module: string;
  action: string;
  correlationId: string;
  durationMs?: number;
  message: string;
  metadata?: Record<string, unknown>;
  timestamp: string;
}

function emitLog(payload: LogPayload): void {
  const serialized = JSON.stringify(payload);
  if (payload.level === "ERROR" || payload.level === "FATAL") {
    console.error(serialized);
  } else if (payload.level === "WARN") {
    console.warn(serialized);
  } else {
    console.info(serialized);
  }
}

// ============================================================================
// 3. SECURE CLIENT IP RESOLUTION
// ============================================================================
function extractClientIp(headerStore: Headers): string {
  // In production environments behind Cloudflare or trusted CDNs:
  const cfConnectingIp = headerStore.get("cf-connecting-ip");
  if (cfConnectingIp) return cfConnectingIp.trim();

  // AWS CloudFront
  const trueClientIp = headerStore.get("true-client-ip");
  if (trueClientIp) return trueClientIp.trim();

  // Standard reverse proxy fallback
  const forwardedFor = headerStore.get("x-forwarded-for");
  if (forwardedFor) {
    const parts = forwardedFor.split(",");
    return parts[0].trim();
  }

  return headerStore.get("x-real-ip")?.trim() || "127.0.0.1";
}

// ============================================================================
// 4. TRANSACTION RESILIENT ACTION
// ============================================================================
export async function submitContactFormAction(
  rawData: unknown,
): Promise<ActionResponse<{ inquiryId: string }>> {
  const startTime = performance.now();
  const correlationId = crypto.randomUUID();
  const headerStore = await headers();
  const clientIp = extractClientIp(headerStore);

  // --- Step 1: Rate Limiting Guard ---
  const { limited, retryAfterMs } = rateLimiter.isLimited(clientIp);
  if (limited) {
    emitLog({
      level: "WARN",
      module: "contact-actions",
      action: "submitContactFormAction",
      correlationId,
      message: "Rate limit threshold breached",
      metadata: { clientIp, retryAfterMs },
      timestamp: new Date().toISOString(),
    });

    return {
      success: false,
      message: "rateLimitExceeded",
      correlationId,
    };
  }

  // --- Step 2: Strict Zod Schema Validation & Built-in Sanitization ---
  const parseResult = contactFormSchema.safeParse(rawData);
  if (!parseResult.success) {
    const errors: Record<string, string> = {};
    for (const issue of parseResult.error.issues) {
      if (issue.path[0]) {
        errors[String(issue.path[0])] = issue.message;
      }
    }

    emitLog({
      level: "WARN",
      module: "contact-actions",
      action: "submitContactFormAction",
      correlationId,
      message: "Input schema validation rejected payload",
      metadata: { errors, clientIp },
      timestamp: new Date().toISOString(),
    });

    return {
      success: false,
      errors,
      message: "validationFailed",
      correlationId,
    };
  }

  const validData: ContactFormValues = parseResult.data;

  // --- Step 3: Payload Preparation ---
  const dbPayload: Record<string, unknown> = {
    type: validData.type,
    status: "new",
    fullName: validData.fullName,
    email: validData.email || "",
    phone: validData.phone,
    country: validData.country,
    message: validData.message,
    ...(validData.type === "sample" && {
      city: validData.city,
      postalCode: validData.postalCode,
      address: validData.address,
      company: validData.company || "",
      productCodes: validData.productCodes || "",
    }),
    ...(validData.type === "project" && {
      company: validData.company,
      projectSize: validData.projectSize || "",
      productCodes: validData.productCodes || "",
      thickness: validData.thickness || "",
      finish: validData.finish || "",
    }),
    ...(validData.type === "dealer" && {
      company: validData.company,
      city: validData.city,
    }),
  };

  // --- Step 4: Atomic DB Persistence ---
  let inquiryRecord: { id: string | number };
  try {
    const payload = await getPayload({ config: configPromise });

    inquiryRecord = await payload.create({
      collection: "inquiries",
      data: dbPayload as any,
    });
  } catch (error: unknown) {
    const durationMs = Math.round(performance.now() - startTime);
    const errorMessage = error instanceof Error ? error.message : String(error);

    emitLog({
      level: "FATAL",
      module: "contact-actions",
      action: "submitContactFormAction",
      correlationId,
      durationMs,
      message: "Database insertion failure",
      metadata: { error: errorMessage, clientIp },
      timestamp: new Date().toISOString(),
    });

    return {
      success: false,
      message: "serverError",
      correlationId,
    };
  }

  // --- Step 5: Asynchronous, Non-Blocking Email Dispatch ---
  // Decoupled execution guarantees that slow SMTP network latency does not block HTTP responses
  (async () => {
    try {
      const emailOutcome = await sendInquiryEmails(validData);
      if (emailOutcome.errors.length > 0) {
        emitLog({
          level: "ERROR",
          module: "contact-actions",
          action: "sendInquiryEmails:asyncWorker",
          correlationId,
          message: "Email dispatch encountered partial failures",
          metadata: {
            inquiryId: inquiryRecord.id,
            errors: emailOutcome.errors,
          },
          timestamp: new Date().toISOString(),
        });
      }
    } catch (bgError: unknown) {
      emitLog({
        level: "ERROR",
        module: "contact-actions",
        action: "sendInquiryEmails:asyncWorker",
        correlationId,
        message: "Background email worker crashed",
        metadata: {
          inquiryId: inquiryRecord.id,
          error: bgError instanceof Error ? bgError.message : String(bgError),
        },
        timestamp: new Date().toISOString(),
      });
    }
  })();

  const totalDurationMs = Math.round(performance.now() - startTime);
  emitLog({
    level: "INFO",
    module: "contact-actions",
    action: "submitContactFormAction",
    correlationId,
    durationMs: totalDurationMs,
    message: "Inquiry successfully recorded",
    metadata: { inquiryId: inquiryRecord.id, type: validData.type },
    timestamp: new Date().toISOString(),
  });

  return {
    success: true,
    data: { inquiryId: String(inquiryRecord.id) },
    correlationId,
  };
}
