# AI Agent Usage Evidence

## Tools Used In Development

- Claude Code: long-context code reading, page generation, bug fixing.
- Codex: repository editing, refactoring, build verification, deployment workflow.
- Cursor: local pair-programming and component iteration.
- Windsurf: multi-file context navigation and UI polishing.
- DeepSeek: requirement decomposition and alternative implementation reasoning.

## Why Token Usage Is High

WeijiangHome is a long-running full-stack project rather than a single static page. Useful AI Agent work usually requires reading and correlating:

- WeChat mini-program pages and `app.json`.
- Merchant admin views and route state.
- Backend API contracts.
- Product, order, invoice, model, and user data structures.
- AR preview assets and model loading state.
- Responsive CSS and accessibility logic.

## Example Complex Tasks

| Task | Typical Context |
| --- | --- |
| Fix `app.json` route issue | app config, page files, tabBar, navigation calls |
| Repair cart bottom overlap | cart page, global style, safe-area CSS, order submit state |
| Debug AR model display | product data, model URL, preview component, loader state |
| Implement product sorting | admin table, product API, database order field |
| Add order export | admin UI, API endpoint, permission, CSV/XLSX output |
| Improve AI customer service | knowledge prompts, product data, order status, fallback logic |

## Evidence Included In The Demo

- Token Plan Evidence panel.
- Agent workflow checklist.
- Cross-module readiness board.
- Real floor-plan and raw-room assets.
- Operational product and order tables matching the project domain.

## Monthly Estimate

For continuing development, the project is expected to require high monthly token capacity because Agent tasks often involve multi-file analysis, implementation, verification, and follow-up fixes across multiple stacks.
