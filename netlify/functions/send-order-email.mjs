import nodemailer from "nodemailer";

export default async function handler(request) {
  if (request.method !== "POST") {
    return new Response(
      JSON.stringify({ message: "Method not allowed" }),
      {
        status: 405,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  try {
    const { customer, items, total } = await request.json();

    if (
      !customer?.name ||
      !customer?.email ||
      !customer?.phone ||
      !customer?.address ||
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return new Response(
        JSON.stringify({
          message: "Missing required order information.",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: process.env.EMAIL_SECURE === "true",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const itemLines = items
      .map(
        (item) =>
          `${item.name} × ${item.quantity} — $${(
            item.price * item.quantity
          ).toFixed(2)}`
      )
      .join("\n");

    console.log("Email configuration:", {
  emailUserExists: Boolean(process.env.EMAIL_USER),
  emailPasswordExists: Boolean(process.env.EMAIL_PASSWORD),
  emailFrom: process.env.EMAIL_FROM,
  storeEmail: process.env.STORE_EMAIL,
  });

    const customerMessage = [
      `Hi ${customer.name},`,
      "",
      "Thank you for your Boston Dumplings order.",
      "",
      itemLines,
      "",
      `Total: $${Number(total).toFixed(2)}`,
      "",
      `Delivery address: ${customer.address}`,
      `Phone: ${customer.phone}`,
      customer.notes
        ? `Order notes: ${customer.notes}`
        : "Order notes: None",
      "",
      "We will contact you with an order update.",
      "",
      "Boston Dumplings",
    ].join("\n");

    const customerResult = await transporter.sendMail({
      from: `"Boston Dumplings" <${process.env.EMAIL_FROM}>`,
      to: customer.email,
      replyTo: process.env.STORE_EMAIL,
      subject: "Boston Dumplings order confirmation",
      text: customerMessage,
    });

    console.log("Customer email result:", {
      messageId: customerResult.messageId,
      accepted: customerResult.accepted,
      rejected: customerResult.rejected,
      response: customerResult.response,
    });

    const storeMessage = [
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
    ].join("\n");

      const storeResult = await transporter.sendMail({
        from: `"Boston Dumplings Website" <${process.env.EMAIL_FROM}>`,
        to: process.env.STORE_EMAIL,
        replyTo: customer.email,
        subject: `New order from ${customer.name}`,
        text: storeMessage,
      });

      console.log("Store email result:", {
        messageId: storeResult.messageId,
        accepted: storeResult.accepted,
        rejected: storeResult.rejected,
        response: storeResult.response,
      });

      await transporter.verify();
      console.log("SMTP connection verified");

      if (customerResult.accepted.length === 0) {
        throw new Error("Customer email was not accepted by the mail server.");
      }

      if (storeResult.accepted.length === 0) {
        throw new Error("Store email was not accepted by the mail server.");
      }

    return new Response(
      JSON.stringify({
        message: "Order submitted successfully.",
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Order email error:", error);

    return new Response(
      JSON.stringify({
        message: "The order could not be submitted.",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}