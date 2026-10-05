---
title: "Declare an application"
slug: declare-an-app
layout: code
eyebrow: "Example"
subtitle: "An Argo CD Application points a cluster at a Git path."
notes: "Argo CD is shown as one example; Flux uses GitRepository and Kustomization resources for the same purpose. The repository URL is a placeholder. Pin to a tag or commit when you need stricter control."
---
```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: shop
  namespace: argocd
spec:
  project: default
  source:
    repoURL: https://git.example.com/platform-config.git
    targetRevision: main
    path: apps/shop/overlays/production
  destination:
    server: https://kubernetes.default.svc
    namespace: shop
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
```

`prune` removes deleted resources; `selfHeal` reverts manual drift.
