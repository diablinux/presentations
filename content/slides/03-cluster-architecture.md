---
title: "Cluster Architecture"
slug: "cluster-architecture"
layout: diagram
eyebrow: "Architecture"
subtitle: "A cluster is a control plane that makes decisions, plus worker nodes that run the workloads."
flow:
  - Operators
  - API server
  - Controllers
  - Worker nodes
notes: ""
section: true
---

### Control Plane

- **kube-apiserver** — the front door: REST API and validation
- **etcd** — cluster state, the source of truth
- **kube-scheduler** — picks a node for every new pod
- **kube-controller-manager** — runs the reconciliation loops

### Worker nodes

- **kubelet** — runs and monitors assigned pods
- **kube-proxy** — programs service networking
- **containerd** — starts and stops containers
- Pods are scheduled across nodes to run application workloads

Everything communicates through the API server — no component talks directly to another.
