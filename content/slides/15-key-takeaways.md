---
title: "Key Takeaways"
slug: "key-takeaways"
layout: bullets
eyebrow: "Wrap up"
subtitle: "Six ideas to carry into your next cluster."
notes: ""
section: true
reveal: true
---

1. Everything is declarative. You write intent; controllers close the gap between desired and observed state.
2. The API server is the hub. Every component reads and writes through it — never directly to each other.
3. Pods are cattle. Never manage them directly — let Deployments, StatefulSets, Jobs and DaemonSets do it.
4. Labels and selectors are the glue. Get them right and everything else composes cleanly.
5. Services and Ingress are how the outside world reaches your pods — and how your pods reach each other.
6. Set requests and limits, add probes, and autoscale. Those three habits prevent most production incidents.

> **Now go break a cluster.** Kind, minikube and k3s will give you a real one in under a minute.

```bash
kind create cluster --name demo
```
