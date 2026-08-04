import assert from "node:assert/strict";
import test from "node:test";

import {
  normalizePhoneNumber,
  sendOrderConfirmationSms,
} from "./sms.mjs";

const twilioEnvironmentKeys = [
  "TWILIO_ACCOUNT_SID",
  "TWILIO_AUTH_TOKEN",
  "TWILIO_PHONE_NUMBER",
];

async function withTwilioEnvironment(values, callback) {
  const previousValues = Object.fromEntries(
    twilioEnvironmentKeys.map((key) => [key, process.env[key]])
  );

  for (const key of twilioEnvironmentKeys) {
    if (values[key] === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = values[key];
    }
  }

  try {
    return await callback();
  } finally {
    for (const key of twilioEnvironmentKeys) {
      if (previousValues[key] === undefined) {
        delete process.env[key];
      } else {
        process.env[key] = previousValues[key];
      }
    }
  }
}

test("normalizes common US phone-number formats", () => {
  assert.equal(normalizePhoneNumber("(617) 555-0123"), "+16175550123");
  assert.equal(normalizePhoneNumber("1-617-555-0123"), "+16175550123");
});

test("keeps valid international E.164 phone numbers", () => {
  assert.equal(normalizePhoneNumber("+44 20 7946 0958"), "+442079460958");
});

test("rejects incomplete phone numbers", () => {
  assert.equal(normalizePhoneNumber("617-555"), null);
});

test("does not call Twilio when SMS is not configured", async () => {
  await withTwilioEnvironment({}, async () => {
    const result = await sendOrderConfirmationSms({
      phone: "617-555-0123",
      orderId: 42,
      orderType: "pickup",
      total: 24,
      fetchImpl: () => {
        throw new Error("Twilio should not be called.");
      },
    });

    assert.deepEqual(result, {
      sent: false,
      reason: "not-configured",
    });
  });
});

test("creates a Twilio order-confirmation request", async () => {
  await withTwilioEnvironment(
    {
      TWILIO_ACCOUNT_SID: "AC123",
      TWILIO_AUTH_TOKEN: "secret",
      TWILIO_PHONE_NUMBER: "+16175550000",
    },
    async () => {
      let request;

      const result = await sendOrderConfirmationSms({
        phone: "(617) 555-0123",
        orderId: 42,
        orderType: "pickup",
        total: 24,
        fetchImpl: async (url, options) => {
          request = { url, options };

          return {
            ok: true,
            json: async () => ({
              sid: "SM123",
              status: "queued",
            }),
          };
        },
      });

      assert.equal(
        request.url,
        "https://api.twilio.com/2010-04-01/Accounts/AC123/Messages.json"
      );
      assert.equal(request.options.method, "POST");
      assert.equal(request.options.body.get("To"), "+16175550123");
      assert.equal(request.options.body.get("From"), "+16175550000");
      assert.match(
        request.options.body.get("Body"),
        /Order #42 confirmed for pickup\. Total \$24\.00\./
      );
      assert.ok(request.options.body.get("Body").length <= 160);
      assert.deepEqual(result, {
        sent: true,
        sid: "SM123",
        status: "queued",
        recipientLastFour: "0123",
      });
    }
  );
});
