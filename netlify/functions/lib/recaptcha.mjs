const VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify";
const DEFAULT_MIN_SCORE = 0.5;

function getMinimumScore() {
  const rawScore = process.env.RECAPTCHA_MIN_SCORE;
  const configuredScore = Number(rawScore);

  if (
    rawScore != null &&
    rawScore.trim() !== "" &&
    Number.isFinite(configuredScore) &&
    configuredScore >= 0 &&
    configuredScore <= 1
  ) {
    return configuredScore;
  }

  return DEFAULT_MIN_SCORE;
}

export function getClientIp(event) {
  const headers = event.headers || {};

  return (
    headers["x-nf-client-connection-ip"] ||
    headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
    null
  );
}

export async function verifyRecaptcha({
  token,
  expectedAction,
  remoteIp,
}) {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;

  if (!secretKey) {
    console.error("reCAPTCHA configuration error: missing secret key.");
    return {
      ok: false,
      statusCode: 503,
      message: "Order protection is temporarily unavailable.",
    };
  }

  if (typeof token !== "string" || !token) {
    return {
      ok: false,
      statusCode: 400,
      message: "Order verification is required. Please try again.",
    };
  }

  const requestBody = new URLSearchParams({
    secret: secretKey,
    response: token,
  });

  if (remoteIp) {
    requestBody.set("remoteip", remoteIp);
  }

  try {
    const response = await fetch(VERIFY_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: requestBody,
    });

    if (!response.ok) {
      throw new Error(`Verification service returned ${response.status}.`);
    }

    const result = await response.json();
    const minScore = getMinimumScore();
    const passed =
      result.success === true &&
      result.action === expectedAction &&
      Number.isFinite(result.score) &&
      result.score >= minScore;

    if (!passed) {
      console.warn("reCAPTCHA verification rejected:", {
        success: result.success,
        action: result.action,
        expectedAction,
        score: result.score,
        minScore,
        hostname: result.hostname,
        errorCodes: result["error-codes"],
      });

      return {
        ok: false,
        statusCode: 403,
        message: "We could not verify this order. Please try again.",
      };
    }

    return { ok: true };
  } catch (error) {
    console.error("reCAPTCHA verification error:", error.message);
    return {
      ok: false,
      statusCode: 503,
      message: "Order verification is temporarily unavailable.",
    };
  }
}
