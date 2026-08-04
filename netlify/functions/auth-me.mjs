import { getAuthenticatedUserId } from "./lib/auth.mjs";
import { getPool } from "./lib/db.mjs";
import { ensureSchema } from "./lib/schema.mjs";
import { jsonResponse, methodNotAllowed } from "./lib/http.mjs";

export async function handler(event) {
  if (event.httpMethod !== "GET") {
    return methodNotAllowed("GET");
  }

  let userId;

  try {
    userId = getAuthenticatedUserId(event);
  } catch {
    return jsonResponse(401, {
      message: "Your session is invalid or has expired.",
    });
  }

  if (!userId) {
    return jsonResponse(401, { message: "You must be signed in." });
  }

  try {
    await ensureSchema();

    const [users] = await getPool().execute(
      `SELECT id, full_name, email, phone, address
       FROM users
       WHERE id = ?`,
      [userId]
    );

    if (users.length === 0) {
      return jsonResponse(404, { message: "User account not found." });
    }

    const user = users[0];

    return jsonResponse(200, {
      user: {
        id: user.id,
        name: user.full_name,
        email: user.email,
        phone: user.phone,
        address: user.address,
      },
    });
  } catch (error) {
    console.error("Current-user error:", error);
    return jsonResponse(500, {
      message: "Unable to retrieve the user account.",
    });
  }
}
