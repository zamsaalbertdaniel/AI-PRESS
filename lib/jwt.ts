interface JWTPayload {
  sub: string;
  role: "admin";
  iat: number;
  exp: number;
}

const encoder = new TextEncoder();

function toBase64Url(input: string): string {
  if (typeof Buffer !== "undefined") {
    return Buffer.from(input, "utf-8")
      .toString("base64")
      .replace(/=/g, "")
      .replace(/\+/g, "-")
      .replace(/\//g, "_");
  }

  return btoa(input).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

function fromBase64Url(base64url: string): string {
  const base64 = base64url.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64 + "===".slice((base64.length + 3) % 4);

  if (typeof Buffer !== "undefined") {
    return Buffer.from(padded, "base64").toString("utf-8");
  }

  return atob(padded);
}

function bytesToBase64Url(bytes: Uint8Array): string {
  if (typeof Buffer !== "undefined") {
    return Buffer.from(bytes)
      .toString("base64")
      .replace(/=/g, "")
      .replace(/\+/g, "-")
      .replace(/\//g, "_");
  }

  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });

  return btoa(binary).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

async function hmacSign(data: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(data));
  return bytesToBase64Url(new Uint8Array(signature));
}

function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i += 1) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

export async function generateAdminJWT(secret: string): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const payload: JWTPayload = {
    sub: "aipress-admin",
    role: "admin",
    iat: now,
    exp: now + 60 * 60 * 24,
  };

  const header = { alg: "HS256", typ: "JWT" };
  const encodedHeader = toBase64Url(JSON.stringify(header));
  const encodedPayload = toBase64Url(JSON.stringify(payload));
  const data = `${encodedHeader}.${encodedPayload}`;
  const signature = await hmacSign(data, secret);

  return `${data}.${signature}`;
}

export async function verifyAdminJWT(token: string, secret: string): Promise<boolean> {
  const parts = token.split(".");
  if (parts.length !== 3) {
    return false;
  }

  const [headerB64, payloadB64, signature] = parts;

  try {
    const header = JSON.parse(fromBase64Url(headerB64)) as { alg?: string; typ?: string };
    const payload = JSON.parse(fromBase64Url(payloadB64)) as Partial<JWTPayload>;

    if (header.alg !== "HS256" || header.typ !== "JWT") {
      return false;
    }

    const now = Math.floor(Date.now() / 1000);
    if (
      payload.role !== "admin" ||
      payload.sub !== "aipress-admin" ||
      typeof payload.exp !== "number" ||
      payload.exp <= now
    ) {
      return false;
    }

    const expectedSig = await hmacSign(`${headerB64}.${payloadB64}`, secret);
    return safeEqual(signature, expectedSig);
  } catch {
    return false;
  }
}
