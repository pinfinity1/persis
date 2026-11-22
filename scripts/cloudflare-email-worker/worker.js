// scripts/cloudflare-email-worker/worker.js
/**
 * Standalone Cloudflare Email Worker for Persis Quartz (Zero-Dependency)
 * 
 * Works 100% natively in the Cloudflare Dashboard web editor without any npm packages.
 */

function decodeBase64Utf8(b64) {
  try {
    const binary = atob(b64.replace(/\s/g, ""));
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

function parseMimeBody(rawText, contentTypeHeader) {
  let text = "";
  let html = "";
  const attachments = [];

  const boundaryMatch = contentTypeHeader?.match(/boundary="?([^";\s]+)"?/i);

  if (boundaryMatch) {
    const boundary = boundaryMatch[1];
    const parts = rawText.split(new RegExp(`--${boundary}(?:--)?`));

    for (const part of parts) {
      const trimmed = part.trim();
      if (!trimmed || trimmed === "--") continue;

      const delimiter = trimmed.includes("\r\n\r\n") ? "\r\n\r\n" : "\n\n";
      const splitIdx = trimmed.indexOf(delimiter);
      if (splitIdx === -1) continue;

      const partHeaders = trimmed.substring(0, splitIdx);
      let partBody = trimmed.substring(splitIdx + delimiter.length);

      const partContentType = (partHeaders.match(/Content-Type:\s*([^;\r\n]+)/i) || [])[1]?.toLowerCase() || "";
      const transferEncoding = (partHeaders.match(/Content-Transfer-Encoding:\s*([^\r\n]+)/i) || [])[1]?.toLowerCase().trim();
      const disposition = (partHeaders.match(/Content-Disposition:\s*([^\r\n]+)/i) || [])[1]?.toLowerCase() || "";
      const filenameMatch = partHeaders.match(/filename="?([^";\r\n]+)"?/i) || partHeaders.match(/name="?([^";\r\n]+)"?/i);

      if (disposition.includes("attachment") || filenameMatch) {
        const filename = filenameMatch ? decodeMimeWord(filenameMatch[1]) : "attachment";
        const contentBase64 = transferEncoding === "base64" ? partBody.replace(/\s/g, "") : btoa(partBody);
        attachments.push({
          filename,
          mimeType: partContentType || "application/octet-stream",
          contentBase64,
        });
      } else if (partContentType.includes("text/html")) {
        if (transferEncoding === "base64") {
          html = decodeBase64Utf8(partBody);
        } else if (transferEncoding === "quoted-printable") {
          html = decodeQuotedPrintable(partBody);
        } else {
          html = partBody;
        }
      } else if (partContentType.includes("text/plain")) {
        if (transferEncoding === "base64") {
          text = decodeBase64Utf8(partBody);
        } else if (transferEncoding === "quoted-printable") {
          text = decodeQuotedPrintable(partBody);
        } else {
          text = partBody;
        }
      }
    }
  } else {
    const transferEncoding = (contentTypeHeader?.match(/Content-Transfer-Encoding:\s*([^\r\n]+)/i) || [])[1]?.toLowerCase().trim();
    if (contentTypeHeader?.includes("text/html")) {
      html = transferEncoding === "base64" ? decodeBase64Utf8(rawText) : transferEncoding === "quoted-printable" ? decodeQuotedPrintable(rawText) : rawText;
    } else {
      text = transferEncoding === "base64" ? decodeBase64Utf8(rawText) : transferEncoding === "quoted-printable" ? decodeQuotedPrintable(rawText) : rawText;
    }
  }

  return { text: text.trim(), html: html.trim(), attachments };
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
  return Array.from(new Uint8Array(signature))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}

const worker = {
  async email(message, env) {
    try {
      const rawText = await new Response(message.raw).text();
      const delimiter = rawText.includes("\r\n\r\n") ? "\r\n\r\n" : "\n\n";
      const splitIdx = rawText.indexOf(delimiter);
      const headerPart = splitIdx !== -1 ? rawText.substring(0, splitIdx) : "";
      const bodyPart = splitIdx !== -1 ? rawText.substring(splitIdx + delimiter.length) : rawText;

      const contentTypeHeader = (headerPart.match(/Content-Type:\s*([^\r\n]+)/i) || [])[1] || "";
      const { text, html, attachments } = parseMimeBody(bodyPart, contentTypeHeader);

      const payload = {
        messageId: message.headers.get("message-id") || `<${Date.now()}@persisquartz.com>`,
        from: message.from,
        fromName: decodeMimeWord((message.headers.get("from")?.match(/^"?([^"<]+)"?\s*</) || [])[1]?.trim()),
        to: message.to,
        cc: message.headers.get("cc") || undefined,
        subject: decodeMimeWord(message.headers.get("subject") || "(بدون موضوع)"),
        date: message.headers.get("date") || new Date().toISOString(),
        text: text || "(پیام متنی موجود نیست)",
        html: html || undefined,
        inReplyTo: message.headers.get("in-reply-to") || undefined,
        references: message.headers.get("references") || undefined,
        attachments,
      };

      const payloadJson = JSON.stringify(payload);
      const secret = env.WEBHOOK_SECRET || "persisquartz-email-webhook-secret-change-in-prod";
      const signature = await generateHmac(payloadJson, secret);

      const targetUrl = env.WEBHOOK_URL || "https://persisquartz.com/api/webhooks/mail-inbound";

      const res = await fetch(targetUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Email-Signature": signature,
        },
        body: payloadJson,
      });

      if (!res.ok) {
        console.error(`[Email Worker] Webhook rejected: ${res.status}`);
      }
    } catch (err) {
      console.error("[Email Worker] Fatal error processing email:", err);
    }
  },
};

export default worker;
