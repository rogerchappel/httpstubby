# Webhook Receiver Fixture Demo

This demo uses HTTPStubby as a local webhook sender stand-in. It gives you two
stable webhook responses without depending on a payment provider sandbox or a
public tunnel.

## Run It

```sh
bash demo/webhook-receiver-smoke.sh
```

The script starts HTTPStubby on port `8791`, calls the webhook routes, and
writes headers and bodies under:

```text
/tmp/httpstubby-webhook-demo
```

## Fixture Routes

- `POST /webhooks/payment.succeeded` returns `202` with
  `X-Webhook-Fixture: payment-succeeded`.
- `POST /webhooks/payment.failed` returns `409` with
  `X-Webhook-Fixture: payment-failed`.

Use these fixtures when you want to demo receiver logic, retry behavior, or
local contract checks without exposing a development machine to the internet.
