---
title: "Scaling Up and Down: Elasticity"
slug: scaling-strategies
layout: content
notes: "Production systems must handle variable load. Kubernetes provides powerful scaling mechanisms, but they need to be tuned correctly based on application needs and resource constraints."
---

# Scaling: Handling Variable Load

A production system must be elastic—it must handle sudden spikes in traffic and scale down efficiently to manage costs.

**Kubernetes Scaling Tools:**
*   **Horizontal Pod Autoscaler (HPA):** Automatically scales the number of pod replicas based on observed metrics (e.g., CPU utilization, custom queue length).
*   **Cluster Autoscaler:** Scales the underlying infrastructure (the cluster nodes themselves) up or down when pods are pending due to resource constraints.
*   **Resource Requests/Limits:** Defining these is critical. `Requests` ensure the scheduler places pods on nodes with guaranteed resources, while `Limits` prevent a runaway pod from consuming all node resources.