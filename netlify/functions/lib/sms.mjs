const TWILIO_MESSAGES_URL =
  "https://api.twilio.com/2010-04-01/Accounts";

export function normalizePhoneNumber(value) {
  const phone = String(value || "").trim();
  const internationalNumber = phone.replace(/[\s().-]/g, "");

  if (/^\+[1-9]\d{7,14}$/.test(internationalNumber)) {
    return internationalNumber;
  }

  const digits = phone.replace(/\D/g, "");

  if (digits.length === 10) {
    return `+1${digits}`;
  }

  if (digits.length === 11 && digits.startsWith("1")) {
    return `+${digits}`;
  }

  return null;
}

export async function sendOrderConfirmationSms({
  phone,
  orderId,
  orderType,
  total,
  fetchImpl = fetch,
}) {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_PHONE_NUMBER;

  if (!accountSid || !authToken || !from) {
    return {
      sent: false,
      reason: "not-configured",
    };
  }

  const to = normalizePhoneNumber(phone);

  if (!to) {
    return {
      sent: false,
      reason: "invalid-phone",
    };
  }

  const safeOrderId = String(orderId || "")
    .replace(/[^a-zA-Z0-9-]/g, "")
    .slice(0, 32);
  const orderReference = safeOrderId ? ` #${safeOrderId}` : "";
  const fulfillment = orderType === "pickup" ? "pickup" : "delivery";
  const body = [
    `Boston Dumplings: Order${orderReference} confirmed for ${fulfillment}.`,
    `Total $${Number(total).toFixed(2)}.`,
    "We'll contact you with an update.",
    "Reply STOP to opt out.",
  ].join(" ");
  const formData = new URLSearchParams({
    To: to,
    From: from,
    Body: body,
  });
  const authorization = Buffer.from(
    `${accountSid}:${authToken}`
  ).toString("base64");
  const response = await fetchImpl(
    `${TWILIO_MESSAGES_URL}/${accountSid}/Messages.json`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${authorization}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData,
    }
  );
  const result = await response.json();

  if (!response.ok) {
    const error = new Error(result.message || "Twilio rejected the message.");
    error.code = result.code;
    throw error;
  }

  return {
    sent: true,
    sid: result.sid,
    status: result.status,
    recipientLastFour: to.slice(-4),
  };
}
