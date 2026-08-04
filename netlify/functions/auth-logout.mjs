import { createExpiredSessionCookie } from "./lib/auth.mjs";
import { jsonResponse, methodNotAllowed } from "./lib/http.mjs";

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return methodNotAllowed("POST");
  }

  return jsonResponse(
    200,
    { message: "Signed out successfully!" },
    { "Set-Cookie": createExpiredSessionCookie() }
  );
}
