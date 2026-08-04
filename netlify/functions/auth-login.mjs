import bcrypt from "bcryptjs";
import { getPool } from "./lib/db.mjs";
import { ensureSchema } from "./lib/schema.mjs";
import {
  createSessionCookie,
  createSessionToken,
} from "./lib/auth.mjs";
import {
  jsonResponse,
  methodNotAllowed,
  parseJsonBody,
} from "./lib/http.mjs";

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return methodNotAllowed("POST");
  }

  const body = parseJsonBody(event);

  if (!body) {
    return jsonResponse(400, { message: "Invalid JSON request." });
  }

  const { email, password } = body;

  if (
    typeof email !== "string" ||
    typeof password !== "string" ||
    !email.trim() ||
    !password ||
    password.length > 128
  ) {
    return jsonResponse(400, { message: "Email and password are required." });
  }

  try {
    await ensureSchema();

    const [users] = await getPool().execute(
      `SELECT id, full_name, email, phone, address, password_hash
       FROM users
       WHERE email = ?`,
      [email.trim().toLowerCase()]
    );

    if (users.length === 0) {
      return jsonResponse(401, { message: "Incorrect email or password." });
    }

    const user = users[0];
    const passwordMatches = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatches) {
      return jsonResponse(401, { message: "Incorrect email or password." });
    }

    const token = createSessionToken(user.id);

    return jsonResponse(
      200,
      {
        message: "Sign in successful!",
        user: {
          id: user.id,
          name: user.full_name,
          email: user.email,
          phone: user.phone,
          address: user.address,
        },
      },
      { "Set-Cookie": createSessionCookie(token) }
    );
  } catch (error) {
    console.error("Login error:", error);
    return jsonResponse(500, { message: "Unable to sign in." });
  }
}
