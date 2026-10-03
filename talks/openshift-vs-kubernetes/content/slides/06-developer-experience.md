---
title: Developer Experience
slug: developer-experience
layout: cards
eyebrow: Day-to-day work
notes: The oc CLI covers kubectl-style commands plus OpenShift extras. Show how familiar it is.
components:
  - type: terminal
    command: oc get pods
    output: |-
      NAME        READY   STATUS
      web-1-abc   1/1     Running
---
## Web console
OpenShift ships a full console for developers and admins.

## oc CLI
Works like kubectl, with extras such as projects and login.

## Builds
Source-to-Image and image streams are built in; Kubernetes needs external tools.
