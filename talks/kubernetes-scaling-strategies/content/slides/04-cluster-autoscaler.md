---
title: Cluster Autoscaler
slug: cluster-autoscaler
layout: bullets
eyebrow: Node capacity
notes: "Describe the common Cluster Autoscaler behavior while noting that exact capabilities and timing depend on the implementation and infrastructure provider. It reacts to schedulability and configured node group limits, not directly to application traffic."
---

- A node autoscaler changes cluster capacity; it does not create application replicas.
- In common Cluster Autoscaler setups, unschedulable pods can trigger node-group scale-up.
- Scale-down is possible when nodes can be removed without violating scheduling and disruption constraints.
- Provider limits, quotas, pod constraints, and provisioning time shape the result.
- Keep spare capacity where waiting for new nodes would violate the workload's latency objectives.
