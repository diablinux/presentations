---
title: "Deployments & ReplicaSets"
slug: "deployments-and-replicasets"
layout: two-column
eyebrow: "Workloads"
subtitle: "The standard way to run stateless apps. A Deployment manages ReplicaSets, which manage Pods."
components:
  - type: code-diff
    before: "replicas: 1"
    after: "replicas: 3"
notes: ""
section: false
---

### Deployment → ReplicaSet → Pods × N

A Deployment continuously enforces the desired replica count and manages safe rollouts, revision history, rollback, and pause/resume.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web
spec:
  replicas: 3
  selector:
    matchLabels:
      app: web
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  template:
    metadata:
      labels:
        app: web
    spec:
      containers:
        - name: web
          image: nginx:1.27
          ports:
            - containerPort: 80
```

---

### What you get

- Desired replica count enforced continuously.
- Rolling updates with `maxSurge` / `maxUnavailable` control.
- Revision history and instant rollback.
- Pause / resume rollouts for canary-style releases.

```bash
# Roll out a new image
kubectl set image deploy/web web=nginx:1.28

# Watch the rollout
kubectl rollout status deploy/web

# Something broke? Go back
kubectl rollout undo deploy/web

# Scale
kubectl scale deploy/web --replicas=10
```
