# Payment Requirements

Backend

POST /api/payments/initiate/{orderId}
POST /api/payments/confirm
POST /api/payments/retry

Pages

- Payment Processing
- Payment Success
- Payment Failed

Routes

- /payment/:orderId
- /payment/success
- /payment/failure

Features

- Payment initiation
- Payment confirmation
- Retry payment

Learning Goals

- Async workflows
- Multi-step transactions
- Retry handling