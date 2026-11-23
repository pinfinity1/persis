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
      } else {
        // Headers might be separated by single \n if standard empty line was stripped
        const matchHeaders = trimmed.match(/^((?:(?:Content-[a-zA-Z-]+|charset)[^\n]*\n?)+)([\s\S]*)$/i);
        if (matchHeaders) {
          headers = matchHeaders[1];
          body = matchHeaders[2];
        }
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
 * Strips raw MIME headers, boundary markers, residual HTML tags, and technical protocols from plain text.
 */
export function stripMimeHeadersAndDelimiters(content: string): string {
  if (!content) return "";
  
  let cleaned = content
    // Strip boundary with attached header on same line e.g. 00000000000024aede0660f1433c Content-Type: ...
    .replace(/^>*[\t ]*-{0,4}[a-zA-Z0-9'()+_,-./:=?]{14,}-{0,4}[\t ]+Content-Type:.*$/gim, "")
    // Strip standalone long boundary markers with or without dashes, with optional quotes (>): e.g. --00000000000024aede0660f1433c-- or 00000000000024aede0660f1433c
    .replace(/^>*[\t ]*-{0,4}[a-zA-Z0-9'()+_,-./:=?]{14,}-{0,4}[\t ]*$/gm, "")
    // Strip boundary markers (including quoted > --)
    .replace(/^>*[\t ]*--[a-zA-Z0-9'()+_,-./:=?]{6,}(?:--)?[\t ]*$/gm, "")
    // Strip Content-Type lines and any attached params
    .replace(/^>*[\t ]*Content-Type:.*$/gim, "")
    // Strip Content-Transfer-Encoding
    .replace(/^>*[\t ]*Content-Transfer-Encoding:.*$/gim, "")
    // Strip Content-Disposition
    .replace(/^>*[\t ]*Content-Disposition:.*$/gim, "")
    // Strip Content-ID
    .replace(/^>*[\t ]*Content-ID:.*$/gim, "")
    // Strip boundary= parameter lines
    .replace(/^>*[\t ]*boundary="?[^"\r\n]+"?[\t ]*$/gim, "")
    // Strip loose charset tokens
    .replace(/^>*[\t ]*charset="?[^"\r\n]+"?[\t ]*$/gim, "")
    .trim();

  // If there are raw residual HTML tags in plain text (e.g. <div dir="ltr">...</div> or <p>...</p>)
  if (/<[a-z][\s\S]*>/i.test(cleaned)) {
    cleaned = cleaned
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/p>/gi, "\n\n")
      .replace(/<\/div>/gi, "\n")
      .replace(/<[^>]+>/g, ""); // Strip any remaining HTML tags
  }

  // Deduplicate identical consecutive lines/blocks (e.g. when text & HTML had identical content)
  const rawLines = cleaned.split("\n");
  const filteredLines: string[] = [];

  for (let i = 0; i < rawLines.length; i++) {
    const current = rawLines[i].trim();
    const prev = filteredLines.length > 0 ? filteredLines[filteredLines.length - 1].trim() : "";

    // If current line is non-empty, identical to previous, and not a quote/divider
    if (current && current === prev && !current.startsWith(">") && !current.startsWith("---")) {
      continue;
    }

    filteredLines.push(rawLines[i]);
  }

  cleaned = filteredLines.join("\n");

  // Normalize multiple empty lines to at most two
  cleaned = cleaned.replace(/\n{3,}/g, "\n\n").trim();

  return cleaned;
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

/**
 * Normalizes Persian, Arabic and Latin text for accurate, high-performance search:
 * - Unifies Persian/Arabic letters (ی/ي, ک/ك, آ/ا)
 * - Strips zero-width non-joiners (نیم‌فاصله) and Harakat/diacritics
 * - Lowercases Latin characters
 * - Strips redundant punctuation and whitespace
 */
export function normalizeSearchString(text: string | null | undefined): string {
  if (!text) return "";
  return text
    .toLowerCase()
    .replace(/[\u064B-\u065F\u0670]/g, "") // Remove Harakat / Tashdeed / Tanween
    .replace(/\u064A/g, "\u06CC")          // Arabic Yeh (ي) -> Persian Yeh (ی)
    .replace(/\u0643/g, "\u06A9")          // Arabic Kaf (ك) -> Persian Kaf (ک)
    .replace(/\u0626/g, "\u06CC")          // Yeh with Hamza (ئ) -> Yeh (ی)
    .replace(/\u0623|\u0625|\u0622/g, "\u0627") // Alef with Hamza/Madda (أ، إ، آ) -> Alef (ا)
    .replace(/\u0629/g, "\u0647")          // Teh Marbuta (ة) -> Heh (ه)
    .replace(/\u200C/g, " ")               // Zero-width non-joiner -> space
    .replace(/[^a-z0-9\u0600-\u06FF\s@._-]/gi, " ") // Clean punctuation except email symbols
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Matches an email against search queries across all fields:
 * - Subject
 * - Sender (from and fromName)
 * - Recipient (to and cc)
 * - Full body text (plain text and stripped HTML)
 * Supports multi-term queries: every term must exist anywhere in the email.
 */
export function matchesSearchQuery(
  email: {
    subject?: string | null;
    from?: string | null;
    fromName?: string | null;
    to?: string | null;
    cc?: string | null;
    bodyText?: string | null;
    bodyHtml?: string | null;
  },
  searchQuery: string
): boolean {
  const normalizedQuery = normalizeSearchString(searchQuery);
  if (!normalizedQuery) return true;

  const terms = normalizedQuery.split(/\s+/).filter(Boolean);
  if (terms.length === 0) return true;

  // Build a single comprehensive searchable corpus of the email
  const fullBody = (email.bodyText || "") + " " + (email.bodyHtml ? email.bodyHtml.replace(/<[^>]+>/g, " ") : "");
  const corpus = normalizeSearchString(
    `${email.subject || ""} ${email.from || ""} ${email.fromName || ""} ${email.to || ""} ${email.cc || ""} ${fullBody}`
  );

  return terms.every((term) => corpus.includes(term));
}
