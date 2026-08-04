# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## SMS order confirmations

Order confirmations can be sent through the Twilio Programmable Messaging API.
Set these environment variables in Netlify before testing:

- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`
- `TWILIO_PHONE_NUMBER` (the SMS-capable Twilio number in E.164 format)

The checkout accepts standard 10-digit US phone numbers and international
numbers written with a leading `+` and country code. If SMS is not configured or
the provider rejects a message, the order and confirmation emails still succeed.

Twilio trial accounts can only text verified recipient numbers. Before sending
production messages to US numbers from a 10-digit long code, complete Twilio's
[A2P 10DLC registration](https://www.twilio.com/docs/messaging/compliance/a2p-10dlc).
