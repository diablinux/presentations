---
title: Reference Architecture
slug: architecture
layout: diagram
eyebrow: Architecture
notes: A typical design has several hosts in a cluster, shared or distributed storage, and virtual networking, all coordinated by a management server. Exact designs vary by size and requirements.
flow:
  - Admin
  - vCenter
  - ESXi cluster
  - Shared storage
---
Hosts in a cluster pool CPU and memory. Storage and network are shared so workloads can move between hosts.
