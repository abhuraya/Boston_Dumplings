import nodemailer from "nodemailer";

export const handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({
        message: "Method not allowed.",
      }),
    };
  }

  try {
    const { customer, items, total } = JSON.parse(event.body || "{}");

    if (
      !customer?.name ||
      !customer?.email ||
      !customer?.phone ||
      !customer?.address ||
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: "Missing required order information.",
        }),
      };
    }

    console.log("Email configuration:", {
      hasHost: Boolean(process.env.EMAIL_HOST),
      hasPort: Boolean(process.env.EMAIL_PORT),
      hasUser: Boolean(process.env.EMAIL_USER),
      hasPassword: Boolean(process.env.EMAIL_PASSWORD),
      emailFrom: process.env.EMAIL_FROM,
      storeEmail: process.env.STORE_EMAIL,
    });

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: process.env.EMAIL_SECURE === "true",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    await transporter.verify();
    console.log("SMTP connection verified.");

    const itemLines = items
      .map((item) => {
        const itemTotal =
          Number(item.price) * Number(item.quantity);

        return `${item.name} × ${item.quantity} — $${itemTotal.toFixed(2)}`;
      })
      .join("\n");

    const customerResult = await transporter.sendMail({
      from: `"Boston Dumplings" <${process.env.EMAIL_FROM}>`,
      to: customer.email,
      replyTo: process.env.STORE_EMAIL,
      subject: "Boston Dumplings order confirmation",
      text: [
        `Hi ${customer.name},`,
        "",
        "Thank you for your Boston Dumplings order.",
        "",
        itemLines,
        "",
        `Total: $${Number(total).toFixed(2)}`,
        `Delivery address: ${customer.address}`,
        `Phone: ${customer.phone}`,
        customer.notes
          ? `Order notes: ${customer.notes}`
          : "Order notes: None",
        "",
        "We will contact you with an order update.",
        "",
        "Boston Dumplings",
      ].join("\n"),
      dsn: {
        id: `boston-dumplings-${Date.now()}`,
        return: "headers",
        notify: ["success", "failure", "delay"],
        recipient: process.env.EMAIL_FROM,
      },
    });

    console.log("Customer email:", {
      messageId: customerResult.messageId,
      envelope: customerResult.envelope,
      accepted: customerResult.accepted,
      rejected: customerResult.rejected,
      response: customerResult.response,
    });

    const storeResult = await transporter.sendMail({
      from: `"Boston Dumplings Website" <${process.env.EMAIL_FROM}>`,
      to: process.env.STORE_EMAIL,
      replyTo: customer.email,
      subject: `New order from ${customer.name}`,
      text: [
        "A new order was submitted.",
        "",
        `Customer: ${customer.name}`,
        `Email: ${customer.email}`,
        `Phone: ${customer.phone}`,
        `Address: ${customer.address}`,
        customer.notes
          ? `Notes: ${customer.notes}`
          : "Notes: None",
        "",
        itemLines,
        "",
        `Total: $${Number(total).toFixed(2)}`,
      ].join("\n"),
      dsn: {
        id: `boston-dumplings-${Date.now()}`,
        return: "headers",
        notify: ["success", "failure", "delay"],
        recipient: process.env.EMAIL_FROM,
      },
    });

   console.log("Store email:", {
      messageId: storeResult.messageId,
      envelope: storeResult.envelope,
      accepted: storeResult.accepted,
      rejected: storeResult.rejected,
      response: storeResult.response,
    });

    if (
      customerResult.accepted.length === 0 ||
      storeResult.accepted.length === 0
    ) {
      throw new Error("One or more email recipients were rejected.");
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Order submitted successfully.",
      }),
    };
  } catch (error) {
    console.error("Order email error:", {
      message: error.message,
      code: error.code,
      command: error.command,
      response: error.response,
    });

    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "The order could not be emailed. Please try again.",
      }),
    };
  }
};