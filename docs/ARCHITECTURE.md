# WeijiangHome Architecture

## Product Modules

| Module | User | Purpose | Current State |
| --- | --- | --- | --- |
| WeChat Mini Program | Buyer | Browse furniture, sign in, cart, order, invoice | MVP pages complete |
| AR Preview | Buyer | Preview furniture scale and placement in a real room | Visual placement demo, model pipeline in progress |
| Merchant Console | Merchant | Manage products, models, sort order, orders | Core table workflow complete |
| Data Board | Merchant / Operator | Track sales, users, AR conversion, exports | Static demo with real project fields |
| AI Service | Buyer / Merchant | Answer sizing, delivery, after-sales, admin questions | Mode switching demo |
| Agent Evidence | Reviewer | Show long-context, multi-file AI Agent usage | Included in UI and README |

## Suggested Full-Stack Layout

```text
weijianghome/
  miniprogram/          WeChat pages, components, app.json
  admin/                Vue merchant console
  server/               Node or Java API service
  database/             schema, seeds, migration docs
  web-demo/             React evidence and online demo
  docs/                 architecture, roadmap, API contracts
```

The current repository ships the `web-demo` surface as a complete deployable proof interface. It is designed to represent the active project state while the native WeChat, Vue, and backend code continue to evolve.

## Data Flow

1. Buyer signs in through WeChat login.
2. Mini program fetches category, product, inventory, model, coupon, and cart data.
3. Buyer opens product detail and launches AR preview.
4. AR layer reads model metadata, dimensions, and space scan results.
5. Buyer submits order, optional invoice request, and payment state.
6. Merchant console receives order, product, inventory, invoice, and export tasks.
7. Data board aggregates user behavior, sales, AR conversion, and product ranking.
8. AI Agent assists development by reading front-end, backend, config, and data contracts.

## Key Interfaces

- `GET /api/products`
- `GET /api/products/:id`
- `POST /api/cart/items`
- `POST /api/orders`
- `POST /api/invoices`
- `POST /api/ar/scan`
- `POST /api/models/upload`
- `GET /api/admin/dashboard`
- `GET /api/admin/orders/export`

## Review Notes

The online demo prioritizes a high-fidelity, product-like representation of the system: real room asset, floor-plan evidence, operational dashboard density, and explicit Agent/token usage proof.
