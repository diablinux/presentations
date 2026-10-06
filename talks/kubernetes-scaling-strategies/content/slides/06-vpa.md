---
title: Vertical Pod Autoscaler
slug: vertical-pod-autoscaler
layout: two-column
eyebrow: Right-size each replica
notes: "VPA can recommend or apply resource request changes depending on its configuration and version. Applying a change may require pod replacement, so teams should understand disruption and avoid competing ownership of the same resource values."
---

### What it helps with

- Recommend CPU and memory requests from observed usage.
- Improve scheduling decisions and resource efficiency.
- Surface workloads whose requests are far from observed needs.

---

### Plan the interaction

- Update behavior can evict and recreate pods.
- Use a disruption strategy that fits the workload.
- Avoid having VPA and HPA compete over the same resource signal; evaluate supported modes and metrics first.
