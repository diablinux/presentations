---
title: "What is Kubernetes?"
slug: "what-is-kubernetes"
layout: cards
eyebrow: "Foundation"
subtitle: "An open-source platform for automating deployment, scaling and operation of containerized applications. You declare the *desired state* — Kubernetes continuously works to make reality match it."
notes: "Emphasize the desired-state loop: operators declare intent while Kubernetes controllers reconcile actual state."
section: false
---

### Declarative model

Describe **what** you want in YAML. Controllers figure out **how** to get there.

### Self-healing

Restarts crashed containers, reschedules pods off failed nodes, replaces unhealthy replicas.

### Horizontal scaling

Add or remove replicas manually, or let the HPA scale on CPU, memory and custom metrics.

### Service discovery

Stable DNS names and virtual IPs in front of pods that come and go constantly.

### Rollouts & rollbacks

Zero-downtime rolling updates with full revision history and one-command rollback.

### Portable & extensible

Runs on any cloud or bare metal. CRDs and operators extend the API endlessly.
