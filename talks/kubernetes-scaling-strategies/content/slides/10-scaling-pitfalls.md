---
title: Avoid Unstable Scaling
slug: scaling-pitfalls
layout: bullets
eyebrow: Tune for stability
notes: "Autoscaling depends on delayed measurements, scheduling, and startup time. Discuss how overly aggressive scale-down, misleading requests, and unavailable capacity can create oscillation or leave demand unserved. Exact tuning depends on workload behavior."
---

- **Oscillation:** use sensible stabilization windows and scale policies.
- **Slow startup:** account for image pulls, initialization, and readiness before expecting new replicas to serve traffic.
- **Unschedulable pods:** inspect requests, affinity, topology constraints, quotas, and node-group limits.
- **Bad signals:** validate metric freshness, units, and whether added replicas can reduce the bottleneck.
- **Surprise scale-down:** protect availability with disruption budgets and graceful termination.
