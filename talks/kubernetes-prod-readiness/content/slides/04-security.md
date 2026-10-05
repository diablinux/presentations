---
title: "Defense in Depth: Securing Your Cluster"
slug: security-best-practices
layout: content
notes: "Security must be layered. We need to address vulnerabilities at the cluster level (RBAC, network policies) and the application level (secure images, secrets management)."
---

# Security: Defense in Depth

Running Kubernetes in production means accepting shared responsibility. Security is not a single checkbox; it's a continuous process of layering defenses.

**Where to Focus:**
1.  **Cluster Level:** Restricting access via Role-Based Access Control (RBAC) and using Network Policies to control pod-to-pod communication.
2.  **Workload Level:** Using read-only root filesystems, running containers as non-root users, and scanning images for vulnerabilities.
3.  **Data Level:** Never storing sensitive data in plain text; using Kubernetes Secrets encrypted at rest and transit.