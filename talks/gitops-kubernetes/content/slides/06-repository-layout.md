---
title: "Organise the repository"
slug: repository-layout
layout: code
eyebrow: "Structure"
subtitle: "One base, one overlay per environment."
notes: "This is one common layout using Kustomize; Helm charts or plain manifests work too. Whether to split app code and config repositories depends on team size and release cadence."
---
```text
platform-config/
├── apps/
│   └── shop/
│       ├── base/
│       │   ├── deployment.yaml
│       │   ├── service.yaml
│       │   └── kustomization.yaml
│       └── overlays/
│           ├── staging/kustomization.yaml
│           └── production/kustomization.yaml
└── clusters/
    ├── staging/
    └── production/
```

Environments differ only in small overlays, so a diff between them is easy to review.
