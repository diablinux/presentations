---
title: "Control Plane Components"
slug: "control-plane-components"
layout: cards
eyebrow: "Architecture"
subtitle: "The brain of the cluster — it decides, records and reconciles."
notes: ""
section: false
---

### kube-apiserver

Exposes the Kubernetes REST API. Validates and persists every object to etcd. Scales horizontally — run several behind a load balancer.

### etcd · State

A consistent, distributed key-value store holding the entire cluster state. **Back it up.** If etcd dies, the cluster's memory dies with it.

### kube-scheduler · Placement

Watches for pods with no node assigned and picks the best fit using resource requests, node affinity, taints/tolerations and topology spread.

### kube-controller-manager · Loops

Runs the reconciliation loops: Deployment, ReplicaSet, Node, Job, EndpointSlice and more. Each loop drives observed state toward desired state.

### cloud-controller-manager · Cloud

Bridges Kubernetes to the cloud provider's API — provisioning load balancers, managing node lifecycle and configuring routes. Optional on bare metal.
