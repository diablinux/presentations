---
title: "Pods"
slug: "pods"
layout: two-column
eyebrow: "Workloads"
subtitle: "The smallest deployable unit in Kubernetes — one or more containers that share a network namespace, IPC and storage volumes."
notes: ""
section: true
---

### Key facts

- Containers in a pod share **localhost** and a single IP.
- Pods are **ephemeral** — they are never repaired in place, only replaced.
- **Init containers** run to completion before app containers start.
- **Sidecars** add logging, proxying or metrics next to the app.
- In production you almost never create a bare Pod — use a controller.

> **Rule of thumb:** a pod is a unit of *co-scheduling*. If two containers must always live and die together on the same node, they belong in the same pod.

---

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: web
  labels:
    app: web
spec:
  containers:
    - name: nginx
      image: nginx:1.27
      ports:
        - containerPort: 80
      resources:
        requests:
          cpu: 100m
          memory: 128Mi
        limits:
          cpu: 500m
          memory: 256Mi
```
