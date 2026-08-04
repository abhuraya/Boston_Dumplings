const SCRIPT_ID = "google-recaptcha-v3";

let scriptPromise;

function getSiteKey() {
  const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

  if (!siteKey) {
    throw new Error(
      "Order protection is not configured. Please try again later."
    );
  }

  return siteKey;
}

function loadRecaptcha(siteKey) {
  if (window.grecaptcha) {
    return Promise.resolve();
  }

  if (scriptPromise) {
    return scriptPromise;
  }

  scriptPromise = new Promise((resolve, reject) => {
    const existingScript = document.getElementById(SCRIPT_ID);

    if (existingScript) {
      existingScript.addEventListener("load", resolve, { once: true });
      existingScript.addEventListener(
        "error",
        () => reject(new Error("Unable to load order protection.")),
        { once: true }
      );
      return;
    }

    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = `https://www.google.com/recaptcha/api.js?render=${encodeURIComponent(siteKey)}`;
    script.async = true;
    script.defer = true;
    script.onload = resolve;
    script.onerror = () => {
      script.remove();
      scriptPromise = undefined;
      reject(new Error("Unable to load order protection."));
    };

    document.head.appendChild(script);
  });

  return scriptPromise;
}

export async function executeRecaptcha(action) {
  const siteKey = getSiteKey();

  await loadRecaptcha(siteKey);

  if (!window.grecaptcha) {
    throw new Error("Unable to load order protection.");
  }

  await new Promise((resolve) => window.grecaptcha.ready(resolve));

  const token = await window.grecaptcha.execute(siteKey, { action });

  if (!token) {
    throw new Error("Unable to verify this order. Please try again.");
  }

  return token;
}
