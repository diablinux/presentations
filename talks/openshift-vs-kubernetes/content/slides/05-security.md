---
title: Security Defaults
slug: security-defaults
layout: comparison
eyebrow: What stands out
notes: OpenShift's restricted-by-default posture often surprises newcomers - images that expect to run as root may fail. Kubernetes can reach the same posture, but you configure it.
---
## Kubernetes

- Policy is configured by you (RBAC, Pod Security Standards)
- Containers may run as root unless restricted
- Authentication is plugged in per cluster

---

## OpenShift

- Security Context Constraints restrict pods by default
- Containers typically run with arbitrary non-root UIDs
- Built-in OAuth for authentication integration
