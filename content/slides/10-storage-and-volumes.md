---
title: "Storage & Volumes"
slug: "storage-and-volumes"
layout: cards
eyebrow: "State"
subtitle: "Containers are ephemeral; data doesn't have to be. Volumes outlive container restarts."
notes: ""
section: false
---

### emptyDir

Scratch space created when the pod starts and deleted when the pod dies. Perfect for caches and sharing files between containers in a pod.

### PersistentVolume

Cluster-level storage provisioned by an admin or dynamically by a StorageClass — NFS, EBS, GCE PD, Ceph, and so on.

### PersistentVolumeClaim

A pod's **request** for storage. Kubernetes binds the claim to a matching volume — this is the abstraction your manifests reference.

### PVC example

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: data
spec:
  accessModes:
    - ReadWriteOnce
  storageClassName: fast-ssd
  resources:
    requests:
      storage: 10Gi
```

### Access modes

- `ReadWriteOnce` — one node, read/write
- `ReadOnlyMany` — many nodes, read-only
- `ReadWriteMany` — many nodes, read/write

### StatefulSets

Give each replica a stable identity, a stable network name, and its own PersistentVolumeClaim via `volumeClaimTemplates`. Use them for databases and anything that needs durable identity.
