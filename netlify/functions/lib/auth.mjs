import jwt from "jsonwebtoken";

const COOKIE_NAME = "authToken";
const SESSION_SECONDS = 7 * 24 * 60 * 60;

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("Missing required environment variable: JWT_SECRET");
  }

  return secret;
}

function getCookie(event, name) {
  const cookieHeader = event.headers?.cookie || event.headers?.Cookie || "";

  for (const cookie of cookieHeader.split(";")) {
    const separatorIndex = cookie.indexOf("=");

    if (separatorIndex === -1) {
      continue;
    }

    const cookieName = cookie.slice(0, separatorIndex).trim();

    if (cookieName === name) {
      return decodeURIComponent(cookie.slice(separatorIndex + 1).trim());
    }
  }

  return null;
}

function cookieSecurityAttributes() {
  return process.env.CONTEXT === "dev" ? "" : "; Secure";
}

export function createSessionToken(userId) {
  return jwt.sign({ userId }, getJwtSecret(), { expiresIn: "7d" });
}

export function createSessionCookie(token) {
  return [
    `${COOKIE_NAME}=${encodeURIComponent(token)}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    `Max-Age=${SESSION_SECONDS}`,
  ].join("; ") + cookieSecurityAttributes();
}

export function createExpiredSessionCookie() {
  return [
    `${COOKIE_NAME}=`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    "Max-Age=0",
  ].join("; ") + cookieSecurityAttributes();
}

export function getAuthenticatedUserId(event) {
  const token = getCookie(event, COOKIE_NAME);

  if (!token) {
    return null;
  }

  const decodedToken = jwt.verify(token, getJwtSecret());
  return decodedToken.userId;
}

export function getOptionalUserId(event) {
  try {
    return getAuthenticatedUserId(event);
  } catch {
    return null;
  }
}
