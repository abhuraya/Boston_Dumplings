import { getOptionalUserId } from "./lib/auth.mjs";
import { getPool } from "./lib/db.mjs";
import { ensureSchema } from "./lib/schema.mjs";
import {
  jsonResponse,
  methodNotAllowed,
  parseJsonBody,
} from "./lib/http.mjs";

const PRODUCTS = new Map([
  [1, { name: "Pork Dumplings", priceCents: 1200 }],
  [2, { name: "Chicken Dumplings", priceCents: 1100 }],
  [3, { name: "Vegetable Dumplings", priceCents: 1000 }],
]);

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ORDER_TYPES = new Set(["delivery", "pickup"]);

function validateAndNormalizeItems(items) {
  if (!Array.isArray(items) || items.length === 0) {
    return null;
  }

  const quantities = new Map();

  for (const item of items) {
    const product = PRODUCTS.get(item?.id);

    if (!product || !Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 100) {
      return null;
    }

    quantities.set(item.id, (quantities.get(item.id) || 0) + item.quantity);

    if (quantities.get(item.id) > 100) {
      return null;
    }
  }

  return [...quantities.entries()].map(([id, quantity]) => ({
    id,
    name: PRODUCTS.get(id).name,
    priceCents: PRODUCTS.get(id).priceCents,
    quantity,
  }));
}

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return methodNotAllowed("POST");
  }

  const body = parseJsonBody(event);

  if (!body) {
    return jsonResponse(400, { message: "Invalid JSON request." });
  }

  const { customer, orderType } = body;
  const items = validateAndNormalizeItems(body.items);

  if (
    typeof customer?.name !== "string" ||
    typeof customer?.email !== "string" ||
    typeof customer?.phone !== "string" ||
    !customer.name.trim() ||
    !customer.email.trim() ||
    !customer.phone.trim()
  ) {
    return jsonResponse(400, {
      message: "Complete customer information is required.",
    });
  }

  if (!ORDER_TYPES.has(orderType)) {
    return jsonResponse(400, {
      message: "Choose delivery or pickup.",
    });
  }

  if (
    orderType === "delivery" &&
    (typeof customer.address !== "string" || !customer.address.trim())
  ) {
    return jsonResponse(400, {
      message: "A delivery address is required for delivery orders.",
    });
  }

  if (!items) {
    return jsonResponse(400, { message: "The order contains an invalid item." });
  }

  if (customer.notes != null && typeof customer.notes !== "string") {
    return jsonResponse(400, { message: "Order notes must be text." });
  }

  const cleanCustomer = {
    name: customer.name.trim(),
    email: customer.email.trim().toLowerCase(),
    phone: customer.phone.trim(),
    address:
      orderType === "delivery" ? customer.address.trim() : null,
    notes: customer.notes?.trim() || null,
  };

  if (!EMAIL_PATTERN.test(cleanCustomer.email)) {
    return jsonResponse(400, { message: "Enter a valid email address." });
  }

  if (
    cleanCustomer.name.length > 255 ||
    cleanCustomer.email.length > 255 ||
    cleanCustomer.phone.length > 50 ||
    (cleanCustomer.address && cleanCustomer.address.length > 500) ||
    (cleanCustomer.notes && cleanCustomer.notes.length > 5000)
  ) {
    return jsonResponse(400, { message: "One or more fields are too long." });
  }

  const totalCents = items.reduce(
    (sum, item) => sum + item.priceCents * item.quantity,
    0
  );

  let connection;

  try {
    await ensureSchema();

    connection = await getPool().getConnection();
    await connection.beginTransaction();

    const tokenUserId = getOptionalUserId(event);
    let userId = null;

    if (tokenUserId) {
      const [users] = await connection.execute(
        "SELECT id FROM users WHERE id = ?",
        [tokenUserId]
      );
      userId = users[0]?.id || null;
    }

    const [orderResult] = await connection.execute(
      `INSERT INTO orders (
        user_id,
        customer_name,
        customer_email,
        customer_phone,
        order_type,
        delivery_address,
        notes,
        total
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        cleanCustomer.name,
        cleanCustomer.email,
        cleanCustomer.phone,
        orderType,
        cleanCustomer.address,
        cleanCustomer.notes,
        (totalCents / 100).toFixed(2),
      ]
    );

    for (const item of items) {
      await connection.execute(
        `INSERT INTO order_items (
          order_id,
          product_id,
          product_name,
          unit_price,
          quantity
        ) VALUES (?, ?, ?, ?, ?)`,
        [
          orderResult.insertId,
          item.id,
          item.name,
          (item.priceCents / 100).toFixed(2),
          item.quantity,
        ]
      );
    }

    await connection.commit();

    return jsonResponse(201, {
      message: "Order saved successfully!",
      orderId: orderResult.insertId,
      total: totalCents / 100,
    });
  } catch (error) {
    if (connection) {
      try {
        await connection.rollback();
      } catch (rollbackError) {
        console.error("Order rollback error:", rollbackError);
      }
    }

    console.error("Order creation error:", error);
    return jsonResponse(500, { message: "Unable to save the order." });
  } finally {
    connection?.release();
  }
}
