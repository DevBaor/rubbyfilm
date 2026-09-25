/**
 * Stream URL Obfuscation & Security Helper
 * Encrypts upstream stream URLs (m3u8/embed) so that they never appear in plain text
 * in API responses, network payloads, or page source.
 */

const STREAM_CIPHER_SECRET =
  process.env.NEXT_PUBLIC_STREAM_CIPHER_SECRET ||
  process.env.STREAM_CIPHER_SECRET ||
  "RubbyFilm_Secure_Stream_2026_Key";

function base64UrlEncode(str: string): string {
  if (typeof Buffer !== "undefined") {
    return Buffer.from(str, "utf-8")
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
  }

  // Browser fallback
  return btoa(
    encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_, p1) =>
      String.fromCharCode(parseInt(p1, 16))
    )
  )
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) {
    base64 += "=";
  }

  if (typeof Buffer !== "undefined") {
    return Buffer.from(base64, "base64").toString("utf-8");
  }

  // Browser fallback
  return decodeURIComponent(
    atob(base64)
      .split("")
      .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
      .join("")
  );
}

/**
 * Encrypts a stream URL before returning in API response
 */
export function encryptStreamUrl(url: string | null | undefined): string {
  if (!url || typeof url !== "string") return "";
  if (url.startsWith("RF_ENC_")) return url;

  const keyChars = STREAM_CIPHER_SECRET.split("").map((c) => c.charCodeAt(0));
  const hexParts: string[] = [];

  for (let i = 0; i < url.length; i++) {
    const code = url.charCodeAt(i) ^ keyChars[i % keyChars.length] ^ ((i * 7) & 0xff);
    hexParts.push(code.toString(16).padStart(2, "0"));
  }

  return "RF_ENC_" + base64UrlEncode(hexParts.join(""));
}

/**
 * Decrypts a stream URL inside the video player right before playback
 */
export function decryptStreamUrl(cipher: string | null | undefined): string {
  if (!cipher || typeof cipher !== "string") return "";
  if (!cipher.startsWith("RF_ENC_")) return cipher;

  try {
    const rawCipher = cipher.slice(7);
    const hex = base64UrlDecode(rawCipher);
    const keyChars = STREAM_CIPHER_SECRET.split("").map((c) => c.charCodeAt(0));
    const chars: string[] = [];

    for (let i = 0; i < hex.length; i += 2) {
      const byte = parseInt(hex.slice(i, i + 2), 16);
      const orig =
        byte ^ keyChars[(i / 2) % keyChars.length] ^ (((i / 2) * 7) & 0xff);
      chars.push(String.fromCharCode(orig));
    }

    return chars.join("");
  } catch {
    return cipher;
  }
}
