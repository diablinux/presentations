---
title: Mapping VMware Concepts
slug: concept-map
layout: content
eyebrow: Translation guide
notes: Mappings are approximate, not one to one. Use this table to orient teams. Live migration depends on shared access-mode storage.
---
| VMware concept | OpenShift Virtualization |
| --- | --- |
| ESXi host | Worker node |
| vCenter | OpenShift control plane and console |
| Datastore | StorageClass and PersistentVolume |
| Port group / vSwitch | Pod network, Multus, NetworkAttachmentDefinition |
| Template | Template or golden image |
| vMotion | Live migration |
| HA / DRS | Node health checks and scheduling |
