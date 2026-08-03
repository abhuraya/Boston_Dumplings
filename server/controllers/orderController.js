const pool = require("../config/db");

async function createOrder(req, res) {
  let connection;

  try {
    const { customer, items } = req.body;

    if (
      !customer?.name?.trim() ||
      !customer?.email?.trim() ||
      !customer?.phone?.trim() ||
      !customer?.address?.trim()
    ) {
      return res.status(400).json({
        message: "Complete customer information is required.",
      });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        message: "The order must contain at least one item.",
      });
    }

    const invalidItem = items.some(
      (item) =>
        !Number.isInteger(item.id) ||
        !item.name?.trim() ||
        !Number.isFinite(Number(item.price)) ||
        Number(item.price) <= 0 ||
        !Number.isInteger(item.quantity) ||
        item.quantity <= 0
    );

    if (invalidItem) {
      return res.status(400).json({
        message: "The order contains an invalid item.",
      });
    }

    const total = items.reduce(
      (sum, item) =>
        sum + Number(item.price) * item.quantity,
      0
    );

    connection = await pool.getConnection();
    await connection.beginTransaction();

    const [orderResult] = await connection.execute(
      `INSERT INTO orders (
        user_id,
        customer_name,
        customer_email,
        customer_phone,
        delivery_address,
        notes,
        total
      )
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        req.userId,
        customer.name.trim(),
        customer.email.trim().toLowerCase(),
        customer.phone.trim(),
        customer.address.trim(),
        customer.notes?.trim() || null,
        total.toFixed(2),
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
        )
        VALUES (?, ?, ?, ?, ?)`,
        [
          orderResult.insertId,
          item.id,
          item.name.trim(),
          Number(item.price).toFixed(2),
          item.quantity,
        ]
      );
    }

    await connection.commit();

    return res.status(201).json({
      message: "Order saved successfully!",
      orderId: orderResult.insertId,
      total,
    });
  } catch (error) {
    if (connection) {
      await connection.rollback();
    }

    console.error("Order creation error:", error);

    return res.status(500).json({
      message: "Unable to save the order.",
    });
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

module.exports = {
  createOrder,
};