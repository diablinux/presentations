---
title: How a VM Runs on OpenShift
slug: architecture
layout: diagram
eyebrow: Architecture
notes: Walk left to right. A VirtualMachine resource is reconciled by the virtualization operator. A launcher pod hosts the QEMU/KVM process, and the guest disk lives on a persistent volume.
flow:
  - VirtualMachine
  - virt-controller
  - virt-launcher pod
  - KVM guest
  - Persistent volume
---
Each VM is a QEMU/KVM process wrapped in a pod. Disks are persistent volumes, so storage class choice matters.
