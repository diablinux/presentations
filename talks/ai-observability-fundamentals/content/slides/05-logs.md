---
title: "Logs preserve event context"
slug: logs
layout: two-column
eyebrow: "Signal 2 · Logs"
subtitle: "A good event record explains what a component observed at a point in time."
notes: "Prefer structured fields over parsing prose. A log should help answer what happened without copying secrets or entire user inputs. Correlation identifiers should be consistent with the tracing approach."
---

### Useful fields

- Timestamp and severity
- Service and operation
- Stable error type or outcome
- Trace and span identifiers when available
- Safe, bounded diagnostic context

---

### Avoid logging

- API keys, credentials, or authorization headers
- Full prompts, responses, or personal data by default
- Unbounded payloads that add cost without helping diagnosis
- Different field names for the same concept across services
