---
title: Scaling Happens at Multiple Layers
slug: scaling-model
layout: bullets
eyebrow: A shared mental model
notes: "Frame scaling as a control loop across layers. A workload controller can request more pods, but scheduling still depends on available resources and application behavior."
---

- **Workload:** adjust the number of pod replicas to match demand.
- **Capacity:** provide enough node resources for those pods to be scheduled.
- **Resources:** size each container's requests so scheduling and utilization targets are meaningful.
- **Lifecycle:** keep traffic flowing as pods become ready, terminate, and leave service.

No single autoscaler solves all four problems.
