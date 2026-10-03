---
title: "kubectl Essentials"
slug: "kubectl-essentials"
layout: code
eyebrow: "Tooling"
subtitle: "The command line is still the fastest way to see what's actually happening."
components:
  - type: terminal
    command: kubectl get pods -o wide
    output: |-
      NAME       READY   STATUS    NODE
      web-6f8d   1/1     Running   worker-1
notes: ""
section: false
---

| Command | What it does |
| --- | --- |
| `kubectl get pods -o wide` | List with nodes & IPs |
| `kubectl describe pod web-0` | Events & full state |
| `kubectl logs -f deploy/web` | Stream container logs |
| `kubectl exec -it web-0 -- sh` | Shell into a container |
| `kubectl apply -f ./k8s` | Declarative sync |
| `kubectl delete -f ./k8s` | Remove everything declared |
| `kubectl port-forward svc/web 8080:80` | Local tunnel |
| `kubectl top pods --sort-by=cpu` | Live resource usage |

> **Pro tip:** set `alias k=kubectl` and enable `kubectl completion bash`. For multi-cluster work, keep contexts straight with `kubectl config use-context`.
