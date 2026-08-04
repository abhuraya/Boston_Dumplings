export function jsonResponse(statusCode, payload, headers = {}) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      ...headers,
    },
    body: JSON.stringify(payload),
  };
}

export function methodNotAllowed(allowedMethod) {
  return jsonResponse(
    405,
    { message: "Method not allowed." },
    { Allow: allowedMethod }
  );
}

export function parseJsonBody(event) {
  try {
    return JSON.parse(event.body || "{}");
  } catch {
    return null;
  }
}
