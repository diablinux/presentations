---
title: Networking and Operations
slug: operations
layout: two-column
eyebrow: Running it
notes: Routes predate Ingress and OpenShift supports both. Upgrade behavior depends on how each cluster is managed.
---
### Kubernetes

- Expose apps with Ingress or Gateway API
- Upgrades depend on your distribution or provider
- Add-ons installed and updated individually

---

### OpenShift

- Routes (Ingress also supported)
- Operators manage the platform; cluster upgrades are coordinated
- Operator catalog for installing add-ons
