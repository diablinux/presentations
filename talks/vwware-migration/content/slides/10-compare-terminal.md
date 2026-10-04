---
title: Verify After Migration
slug: verify
layout: bullets
eyebrow: Validation
notes: Always validate before decommissioning the source. The command shows VM state; compare application behavior against a baseline.
components:
  - type: terminal
    command: oc get vmi -n my-apps
    output: |-
      NAME        AGE   PHASE     IP
      app-vm-01   5m    Running   10.128.2.15
---
- Confirm the VM is running and reachable
- Test the application and dependencies
- Compare performance with the baseline
