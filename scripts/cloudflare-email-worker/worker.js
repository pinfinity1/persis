// scripts/cloudflare-email-worker/worker.js
/**
 * Standalone Cloudflare Email Worker for Persis Quartz (Zero-Dependency)
 * 
 * Works 100% natively in the Cloudflare Dashboard web editor without any npm packages.
 * High-performance, RFC 5322 recursive MIME parser for Gmail, Yahoo, Outlook & Apple Mail.
 */

function decodeBase64Utf8(b64) {
  try {
    const cleanB64 = b64.replace(/[\r\n\s]/g, "");
    const binary = atob(cleanB64);
    const bytes = Uint8Array.from(binary, c => c.charCodeAt(0));
    return new TextDecoder("utf-8").decode(bytes);
  } catch {
    return b64;
  }
}

function decodeQuotedPrintable(str) {
  try {
    const cleaned = str.replace(/=\r?\n/g, "");
    const bytes = [];
    for (let i = 0; i < cleaned.length; i++) {
      if (cleaned[i] === "=" && i + 2 < cleaned.length) {
        const hex = cleaned.substring(i + 1, i + 3);
        const byte = parseInt(hex, 16);
        if (!isNaN(byte)) {
          bytes.push(byte);
          i += 2;
          continue;
        }
      }
      bytes.push(cleaned.charCodeAt(i));
    }
    return new TextDecoder("utf-8").decode(new Uint8Array(bytes));
  } catch {
    return str;
  }
}

function decodeMimeWord(str) {
  if (!str) return "";
  return str.replace(/=\?([^?]+)\?([BQbq])\?([^?]+)\?=/g, (_, charset, encoding, data) => {
    if (encoding.toUpperCase() === "B") {
      return decodeBase64Utf8(data);
    } else {
      return decodeQuotedPrintable(data.replace(/_/g, " "));
    }
  });
}

function stripMimeNoise(str) {
  if (!str) return "";
  return str
    .replace(/^--[a-zA-Z0-9'()+_,-./:=?]{6,}(?:--)?$/gm, "")
    .replace(/^Content-Type:.*$/gim, "")
    .replace(/^Content-Transfer-Encoding:.*$/gim, "")
    .replace(/^Content-Disposition:.*$/gim, "")
    .replace(/^charset=.*$/gim, "")
    .replace(/^\s*[\r\n]/gm, "\n")
    .trim();
}

function parseMimeBody(rawText, contentTypeHeader) {
  let text = "";
  let html = "";
  const attachments = [];

  // Find boundaries from header and auto-detect from body lines
  const boundaries = [];
  const headerMatch = contentTypeHeader?.match(/boundary="?([^";\s\r\n]+)"?/i);
  if (headerMatch && headerMatch[1]) {
    boundaries.push(headerMatch[1].trim());
  }

  const detectedLines = rawText.match(/^--([a-zA-Z0-9'()+_,-./:=?]{8,})(?:--)?$/gm);
  if (detectedLines) {
    for (const line of detectedLines) {
      const bToken = line.replace(/^--/, "").replace(/--$/, "").trim();
      if (bToken && !boundaries.includes(bToken)) {
        boundaries.push(bToken);
      }
    }
  }

  if (boundaries.length > 0) {
    for (const boundary of boundaries) {
      const escaped = boundary.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const parts = rawText.split(new RegExp(`--${escaped}(?:--)?`));

      for (const part of parts) {
        const trimmed = part.trim();
        if (!trimmed || trimmed === "--") continue;

        const delimiter = trimmed.includes("\r\n\r\n") ? "\r\n\r\n" : "\n\n";
        const splitIdx = trimmed.indexOf(delimiter);

        let partHeaders = "";
        let partBody = trimmed;

        if (splitIdx !== -1) {
          partHeaders = trimmed.substring(0, splitIdx);
          partBody = trimmed.substring(splitIdx + delimiter.length);
        }

        const partContentType = (partHeaders.match(/Content-Type:\s*([^;\r\n]+)/i) || [])[1]?.toLowerCase() || "";
        const transferEncoding = (partHeaders.match(/Content-Transfer-Encoding:\s*([^\r\n]+)/i) || [])[1]?.toLowerCase().trim();
        const disposition = (partHeaders.match(/Content-Disposition:\s*([^\r\n]+)/i) || [])[1]?.toLowerCase() || "";
        const filenameMatch = partHeaders.match(/filename="?([^";\r\n]+)"?/i) || partHeaders.match(/name="?([^";\r\n]+)"?/i);

        // Check if this part itself is a nested multipart (e.g. multipart/alternative inside multipart/mixed)
        if (partContentType.includes("multipart/")) {
          const nested = parseMimeBody(partBody, partHeaders);
          if (nested.text && !text) text = nested.text;
          if (nested.html && !html) html = nested.html;
          if (nested.attachments?.length) attachments.push(...nested.attachments);
          continue;
        }

        if (disposition.includes("attachment") || filenameMatch) {
          const filename = filenameMatch ? decodeMimeWord(filenameMatch[1]) : "attachment";
          const contentBase64 = transferEncoding === "base64" ? partBody.replace(/\s/g, "") : btoa(partBody);
          attachments.push({
            filename,
            mimeType: partContentType || "application/octet-stream",
            contentBase64,
          });
        } else if (partContentType.includes("text/html")) {
          let decoded = partBody;
          if (transferEncoding === "base64") decoded = decodeBase64Utf8(partBody);
          else if (transferEncoding === "quoted-printable") decoded = decodeQuotedPrintable(partBody);
          if (!html) html = decoded;
        } else if (partContentType.includes("text/plain")) {
          let decoded = partBody;
          if (transferEncoding === "base64") decoded = decodeBase64Utf8(partBody);
          else if (transferEncoding === "quoted-printable") decoded = decodeQuotedPrintable(partBody);
          if (!text) text = decoded;
        }
      }

      if (text || html) break;
    }
  }

  // Fallback for non-multipart bodies
  if (!text && !html) {
    const transferEncoding = (contentTypeHeader?.match(/Content-Transfer-Encoding:\s*([^\r\n]+)/i) || [])[1]?.toLowerCase().trim();
    if (contentTypeHeader?.includes("text/html")) {
      html = transferEncoding === "base64" ? decodeBase64Utf8(rawText) : transferEncoding === "quoted-printable" ? decodeQuotedPrintable(rawText) : rawText;
    } else {
      text = transferEncoding === "base64" ? decodeBase64Utf8(rawText) : transferEncoding === "quoted-printable" ? decodeQuotedPrintable(rawText) : rawText;
    }
  }

  return {
    text: stripMimeNoise(text),
    html: html.trim(),
    attachments,
  };
}

async function generateHmac(message, secret) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, enc.encode(message));
  const hex = Array.from(new Uint8Array(signature))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
  return hex;
}

const emailWorker = {
  async email(message, env) {
    try {
      const webhookUrl = env.WEBHOOK_URL || "https://persisquartz.com/api/webhooks/mail-inbound";
      const webhookSecret = env.EMAIL_WEBHOOK_SECRET || "persisquartz-email-webhook-secret-change-in-prod";

      const rawStream = message.raw;
      const rawBuffer = await new Response(rawStream).arrayBuffer();
      const rawBytes = new Uint8Array(rawBuffer);
      const rawText = new TextDecoder("utf-8").decode(rawBytes);

      const headers = message.headers;
      const contentTypeHeader = headers.get("content-type") || "";

      const parsed = parseMimeBody(rawText, contentTypeHeader);

      const payload = {
        messageId: headers.get("message-id") || `<${Date.now()}@cloudflare.worker>`,
        from: message.from,
        fromName: decodeMimeWord(headers.get("from")?.split("<")[0]?.trim() || ""),
        to: message.to,
        cc: headers.get("cc") || undefined,
        bcc: headers.get("bcc") || undefined,
        replyTo: headers.get("reply-to") || undefined,
        subject: decodeMimeWord(headers.get("subject") || ""),
        date: headers.get("date") || new Date().toISOString(),
        text: parsed.text,
        html: parsed.html,
        inReplyTo: headers.get("in-reply-to") || undefined,
        references: headers.get("references") || undefined,
        attachments: parsed.attachments,
      };

      const payloadString = JSON.stringify(payload);
      const signature = await generateHmac(payloadString, webhookSecret);

      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-email-signature": signature,
          "User-Agent": "Cloudflare-Email-Worker/2.0",
        },
        body: payloadString,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`[Persis Mail Worker] Webhook failed (${response.status}):`, errorText);
      } else {
        console.log(`[Persis Mail Worker] Successfully routed email to ${message.to}`);
      }
    } catch (err) {
      console.error("[Persis Mail Worker] Fatal unhandled error processing email:", err);
    }
  },
};

export default emailWorker;
