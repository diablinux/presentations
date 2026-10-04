---
title: What Is OpenShift Virtualization?
slug: what-is-ov
layout: two-column
eyebrow: Target platform
notes: OpenShift Virtualization is based on the upstream KubeVirt project. VMs run as KVM virtual machines inside pods, so they use Kubernetes scheduling, networking, and storage. The upstream community project is OKD with KubeVirt.
---
## What it is

- Adds VM support to OpenShift
- Based on upstream KubeVirt
- Uses the KVM hypervisor
- VMs are Kubernetes objects

---

## What it means

- One control plane for VMs and containers
- Manage VMs with YAML, CLI, or console
- VMs get scheduling, RBAC, and quotas
