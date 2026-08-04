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

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return methodNotAllowed("POST");
  }

  const body = parseJsonBody(event);

  if (!body) {
    return jsonResponse(400, { message: "Invalid JSON request." });
  }

  const { name, email, password, address, phone } = body;

  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof password !== "string" ||
    typeof address !== "string" ||
    typeof phone !== "string" ||
    !name.trim() ||
    !email.trim() ||
    !password ||
    !address.trim() ||
    !phone.trim()
  ) {
    return jsonResponse(400, {
      message: "Name, email, phone, address, and password are required.",
    });
  }

  if (password.length < 8 || password.length > 128) {
    return jsonResponse(400, {
      message: "Password must contain between 8 and 128 characters.",
    });
  }

  const cleanName = name.trim();
  const cleanEmail = email.trim().toLowerCase();
  const cleanPhone = phone.trim();
  const cleanAddress = address.trim();

  if (!EMAIL_PATTERN.test(cleanEmail)) {
    return jsonResponse(400, { message: "Enter a valid email address." });
  }

  if (
    cleanName.length > 255 ||
    cleanEmail.length > 255 ||
    cleanPhone.length > 50 ||
    cleanAddress.length > 500
  ) {
    return jsonResponse(400, { message: "One or more fields are too long." });
  }

  try {
    await ensureSchema();

    const passwordHash = await bcrypt.hash(password, 12);
    const [result] = await getPool().execute(
      `INSERT INTO users
       (full_name, email, phone, address, password_hash)
       VALUES (?, ?, ?, ?, ?)`,
      [cleanName, cleanEmail, cleanPhone, cleanAddress, passwordHash]
    );

    const token = createSessionToken(result.insertId);

    return jsonResponse(
      201,
      {
        message: "Account created successfully!",
        user: {
          id: result.insertId,
          name: cleanName,
          email: cleanEmail,
          phone: cleanPhone,
          address: cleanAddress,
        },
      },
      { "Set-Cookie": createSessionCookie(token) }
    );
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return jsonResponse(409, {
        message: "An account with that email already exists.",
      });
    }

    console.error("Registration error:", error);
    return jsonResponse(500, { message: "Unable to create the account." });
  }
}
