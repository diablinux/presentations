---
title: vSphere Core Components
slug: vsphere-core
layout: comparison
eyebrow: Main components
notes: vSphere is the umbrella name for the core virtualization platform. ESXi hosts do the work; vCenter coordinates them. Hosts keep running VMs if vCenter is briefly unavailable, though management features are limited.
---
## ESXi

- Hypervisor installed on each physical server
- Runs virtual machines
- Managed locally or through vCenter

---

## vCenter Server

- Central management for many ESXi hosts
- Inventory, permissions, and monitoring
- Enables clusters and live migration
