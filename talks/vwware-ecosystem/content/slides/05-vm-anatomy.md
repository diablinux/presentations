---
title: Anatomy of a Virtual Machine
slug: vm-anatomy
layout: diagram
eyebrow: Layers
notes: Walk the flow bottom to top. A VM sees virtual hardware; the hypervisor maps it to physical resources. Guest tools or drivers improve performance and integration.
flow:
  - Physical hardware
  - Hypervisor
  - Virtual hardware
  - Guest OS
  - Application
---
A virtual machine is a set of files plus configuration that the hypervisor presents as a complete computer.
