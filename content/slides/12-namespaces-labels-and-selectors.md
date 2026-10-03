---
title: "Namespaces, Labels & Selectors"
slug: "namespaces-labels-and-selectors"
layout: two-column
eyebrow: "Organization"
subtitle: "How you divide a cluster and how Kubernetes finds the objects it needs to manage."
notes: ""
section: false
---

### Namespaces

Virtual clusters inside a physical one. Resource names must be unique **within** a namespace, not across the cluster.

- Scope for RBAC roles and bindings
- Scope for ResourceQuota and LimitRange
- Scope for NetworkPolicy isolation

```bash
kubectl create ns staging
```

---

### Labels & Selectors

Labels are key/value pairs attached to objects. Selectors are queries over labels — they are the glue of the entire system.

```yaml
metadata:
  labels:
    app: web
    tier: frontend
    env: prod
    version: v1.4.2
```

```bash
# Equality-based
kubectl get pods -l app=web,env=prod

# Set-based
kubectl get pods -l 'env in (prod,staging)'
```

Deployments, Services, ReplicaSets, NetworkPolicies and PodDisruptionBudgets all rely on label selectors to decide which pods they own.
