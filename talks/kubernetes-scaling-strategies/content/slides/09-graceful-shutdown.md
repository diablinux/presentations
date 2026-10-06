---
title: Scale Down Without Dropping Work
slug: graceful-shutdown
layout: bullets
eyebrow: Termination is part of scaling
notes: "Pod termination involves endpoint updates and a termination grace period, but traffic propagation and client behavior vary. Applications should stop accepting new work, finish or safely hand off in-flight work, and handle forced termination after the grace period."
---

- On termination, the application should stop accepting new work and handle `SIGTERM`.
- Drain in-flight requests or messages within the configured grace period.
- Use `preStop` only when it supports a deliberate shutdown sequence; it consumes the same grace period.
- Make handlers idempotent or recoverable when work can outlive the pod.
- Test real traffic draining, not just whether the process exits cleanly.
