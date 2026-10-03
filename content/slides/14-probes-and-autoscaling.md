---
title: "Probes & Autoscaling"
slug: "probes-and-autoscaling"
layout: two-column
eyebrow: "Reliability"
subtitle: "How Kubernetes knows your app is alive — and how it grows under load."
notes: ""
section: false
---

### livenessProbe

Failing means **restart the container**. Use it to break out of deadlocks.

### readinessProbe

Failing means **remove from Service endpoints**. Use it to avoid sending traffic to a warming-up pod.

### startupProbe

Disables the other probes until the app has booted. Perfect for slow-starting JVM or legacy apps.

---

### HorizontalPodAutoscaler

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: web
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: web
  minReplicas: 2
  maxReplicas: 20
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70
```

### Scaling layers

- **HPA** — more pods, based on metrics.
- **VPA** — bigger requests/limits per pod.
- **Cluster Autoscaler / Karpenter** — more nodes.

> **Always set requests.** The scheduler and the HPA both depend on them. A pod with no CPU request is invisible to autoscaling and a troublemaker for scheduling.
