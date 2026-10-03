---
title: "Connect signals around one request"
slug: connect-signals
layout: comparison
eyebrow: "Correlation"
subtitle: "Shared context turns separate telemetry into a more useful investigation."
notes: "Walk through a hypothetical slow request. The metric identifies a time window, the trace narrows the slow operation, and a correlated log adds a specific error detail. A trace ID can be sensitive operational metadata too; apply access and retention controls."
---

### Find the symptom

A latency metric shows that slow requests increased after a release.

Use service, route, and time window to narrow the investigation.

---

### Follow the evidence

Inspect a slow trace to see which operation consumed time.

Open a related structured log to understand the failure or unusual event.

Check the same dependency's metrics to see whether the issue is broader.
