---
title: Probes Protect the Workload Lifecycle
slug: probes
layout: bullets
eyebrow: Health and traffic
notes: "Separate the probe roles accurately: startup gates other probes during initialization, readiness controls whether a pod should receive service traffic, and liveness can restart a stuck container. Poorly designed probes can amplify an incident."
---

- **Startup** gives a slow-starting container time to initialize before liveness checks begin.
- **Readiness** controls whether a pod is considered ready for Service traffic.
- **Liveness** detects a process that should be restarted; it is not a general dependency check.
- Probe thresholds and timeouts should reflect real startup and recovery behavior.
- Readiness is a traffic gate, not a guarantee that every client has stopped using an endpoint.
