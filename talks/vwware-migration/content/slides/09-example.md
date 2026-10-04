---
title: Example Migration Plan
slug: example
layout: code
eyebrow: Illustration
notes: This is a simplified illustration of the Forklift Plan resource. Field names and API versions change; confirm against your installed version. Names and namespaces are placeholders.
---
```yaml
apiVersion: forklift.konveyor.io/v1beta1
kind: Plan
metadata:
  name: wave-1
  namespace: openshift-mtv
spec:
  warm: false
  provider:
    source: { name: vmware-source }
    destination: { name: host }
  map:
    network: { name: net-map }
    storage: { name: storage-map }
  vms:
    - name: app-vm-01
```
