// src/lib/mime-parser.ts
/**
 * Production-Grade RFC 5322 & MIME Parser and Cleaner for Persis Quartz Webmail.
 * 
 * Accurately extracts clean human-readable text and HTML from complex, nested
 * multipart emails (Gmail, Yahoo, Outlook, Apple Mail), eliminating all boundary
 * headers (--_Part_, Content-Type, Content-Transfer-Encoding) from the UI.
 */

export function decodeQuotedPrintable(str: string): string {
  try {
    // Remove soft linebreaks
    const cleaned = str.replace(/=\r?\n/g, "");
    const bytes: number[] = [];
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

export function decodeBase64Utf8(b64: string): string {
  try {
    const cleanB64 = b64.replace(/[\r\n\s]/g, "");
    const binary = Buffer.from(cleanB64, "base64");
    return binary.toString("utf-8");
  } catch {
    return b64;
  }
}

export function decodeMimeWord(str: string): string {
  if (!str) return "";
  return str.replace(/=\?([^?]+)\?([BQbq])\?([^?]+)\?=/g, (_, _charset, encoding, data) => {
    if (encoding.toUpperCase() === "B") {
      return decodeBase64Utf8(data);
    } else {
      return decodeQuotedPrintable(data.replace(/_/g, " "));
    }
  });
}

export interface ParsedMimeResult {
  text: string;
  html: string;
}

/**
 * Checks whether a given string is a raw MIME multipart body containing boundary tokens.
 */
export function isRawMimeMultipart(content: string): boolean {
  if (!content) return false;
  return (
    content.includes("Content-Type: text/") ||
    content.includes("Content-Transfer-Encoding:") ||
    /--[a-zA-Z0-9'()+_,-./:=?]{6,}/.test(content)
  );
}

/**
 * Parses a raw MIME body or cleans an existing email text string, extracting pure text and HTML.
 */
export function parseAndCleanMime(raw: string, contentTypeHeader?: string): ParsedMimeResult {
  if (!raw) return { text: "", html: "" };

  // If it's already plain text without any MIME tokens, return as is
  if (!isRawMimeMultipart(raw)) {
    return { text: raw.trim(), html: "" };
  }

  let text = "";
  let html = "";

  // 1. Try to find boundaries: either from header or auto-detected from body lines
  const boundaryList: string[] = [];
  
  if (contentTypeHeader) {
    const match = contentTypeHeader.match(/boundary="?([^";\s\r\n]+)"?/i);
    if (match && match[1]) {
      boundaryList.push(match[1].trim());
    }
  }

  // Auto-detect boundary lines from body: lines starting with -- followed by 8+ chars
  const boundaryLineMatches = raw.match(/^--([a-zA-Z0-9'()+_,-./:=?]{8,})(?:--)?$/gm);
  if (boundaryLineMatches) {
    for (const bLine of boundaryLineMatches) {
      const bToken = bLine.replace(/^--/, "").replace(/--$/, "").trim();
      if (bToken && !boundaryList.includes(bToken)) {
        boundaryList.push(bToken);
      }
    }
  }

  // If no boundary could be found, clean headers line by line
  if (boundaryList.length === 0) {
    return {
      text: stripMimeHeadersAndDelimiters(raw),
      html: "",
    };
  }

  // 2. Iterate through detected boundaries from most specific to outer
  for (const boundary of boundaryList) {
    const escaped = boundary.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const parts = raw.split(new RegExp(`--${escaped}(?:--)?`));

    for (const part of parts) {
      const trimmed = part.trim();
      if (!trimmed || trimmed === "--") continue;

      const delimiter = trimmed.includes("\r\n\r\n") ? "\r\n\r\n" : "\n\n";
      const splitIdx = trimmed.indexOf(delimiter);

      let headers = "";
      let body = trimmed;

      if (splitIdx !== -1) {
        headers = trimmed.substring(0, splitIdx);
        body = trimmed.substring(splitIdx + delimiter.length);
      }

      const partContentType = (headers.match(/Content-Type:\s*([^;\r\n]+)/i) || [])[1]?.toLowerCase() || "";
      const transferEncoding = (headers.match(/Content-Transfer-Encoding:\s*([^\r\n]+)/i) || [])[1]?.toLowerCase().trim();

      // Check if this part is an inner multipart
      if (partContentType.includes("multipart/")) {
        const innerResult = parseAndCleanMime(body, headers);
        if (innerResult.text && !text) text = innerResult.text;
        if (innerResult.html && !html) html = innerResult.html;
        continue;
      }

      let decodedBody = body;
      if (transferEncoding === "base64") {
        decodedBody = decodeBase64Utf8(body);
      } else if (transferEncoding === "quoted-printable") {
        decodedBody = decodeQuotedPrintable(body);
      }

      if (partContentType.includes("text/html")) {
        if (!html) html = decodedBody.trim();
      } else if (partContentType.includes("text/plain")) {
        if (!text) text = decodedBody.trim();
      }
    }

    if (text || html) {
      break;
    }
  }

  // Fallback if parsing didn't isolate parts cleanly
  if (!text && !html) {
    text = stripMimeHeadersAndDelimiters(raw);
  }

  // Final sanitation of any residual delimiter lines in text
  text = stripMimeHeadersAndDelimiters(text);

  return { text, html };
}

/**
 * Strips raw MIME headers, boundary markers, and technical protocols from plain text.
 */
export function stripMimeHeadersAndDelimiters(content: string): string {
  if (!content) return "";
  return content
    .replace(/^--[a-zA-Z0-9'()+_,-./:=?]{6,}(?:--)?$/gm, "") // Strip boundary markers
    .replace(/^Content-Type:.*$/gim, "")                     // Strip Content-Type lines
    .replace(/^Content-Transfer-Encoding:.*$/gim, "")        // Strip Content-Transfer-Encoding
    .replace(/^Content-Disposition:.*$/gim, "")             // Strip Content-Disposition
    .replace(/^Content-ID:.*$/gim, "")                      // Strip Content-ID
    .replace(/^charset=.*$/gim, "")                          // Strip loose charset tokens
    .replace(/^\s*[\r\n]/gm, "\n")                           // Collapse redundant blank lines
    .trim();
}

/**
 * Creates a clean, pristine human-readable snippet (max ~120 chars) for email list previews.
 * Strips all HTML tags, boundary lines, and excessive whitespace.
 */
export function extractCleanSnippet(textOrHtml: string | null | undefined, maxLength: number = 100): string {
  if (!textOrHtml) return "(بدون متن)";

  let clean = textOrHtml;

  // If it contains raw MIME headers, clean them first
  if (isRawMimeMultipart(clean)) {
    const parsed = parseAndCleanMime(clean);
    clean = parsed.text || parsed.html || clean;
  }

  // Strip HTML tags
  clean = clean.replace(/<[^>]*>/g, " ");

  // Strip boundaries and MIME headers
  clean = stripMimeHeadersAndDelimiters(clean);

  // Normalize whitespaces
  clean = clean.replace(/\s+/g, " ").trim();

  if (!clean) return "(بدون متن)";
  if (clean.length <= maxLength) return clean;
  return clean.slice(0, maxLength) + "…";
}
