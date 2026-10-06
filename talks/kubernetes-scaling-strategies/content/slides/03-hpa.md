---
title: Horizontal Pod Autoscaler
slug: horizontal-pod-autoscaler
layout: bullets
eyebrow: Workload replicas
notes: "Explain that HPA periodically compares observed metrics with targets and adjusts a scalable workload's desired replica count. CPU utilization targets rely on CPU requests, and metrics availability and controller timing affect response."
---

- HPA adjusts a Deployment or another supported scalable workload's replica count.
- Resource metrics such as CPU utilization are compared with a configured target.
- CPU utilization is measured relative to container CPU requests; missing or unsuitable requests undermine the target.
- Set minimum and maximum replicas to bound availability and capacity needs.
- Scaling is a feedback loop, not an instantaneous reaction to every request spike.
