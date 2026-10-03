---
title: "Worker Node Components"
slug: "worker-node-components"
layout: cards
eyebrow: "Architecture"
subtitle: "Where containers actually run. Every node runs three things."
flow:
  - kubectl apply
  - API server
  - etcd
  - scheduler
  - kubelet
  - container running
notes: ""
section: false
---

### kubelet

The node agent. Watches PodSpecs assigned to its node and ensures the described containers are running and healthy. Reports node and pod status back to the API server.

### kube-proxy

Maintains iptables / IPVS rules on the node so that Service virtual IPs route to the right pod backends. Makes load balancing work at the network layer.

### Container runtime

A CRI-compliant engine — **containerd** or **CRI-O** — that pulls images and actually starts and stops containers.
