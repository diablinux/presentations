---
title: "Services"
slug: "services"
layout: cards
eyebrow: "Networking"
subtitle: "Pods are ephemeral — their IPs change. A Service gives you a stable virtual IP and DNS name that load-balances across a set of pods."
notes: ""
section: false
---

### ClusterIP

Internal-only virtual IP. The default. Reachable from anywhere inside the cluster.

### NodePort

Opens a static port (30000–32767) on every node. Simple, but rarely the final answer.

### LoadBalancer

Asks the cloud provider for a real external load balancer with a public IP.

### ExternalName

A DNS CNAME alias to an external host — no proxying, no endpoints.

### Example

```yaml
apiVersion: v1
kind: Service
metadata:
  name: web
spec:
  type: ClusterIP
  selector:
    app: web
  ports:
    - name: http
      port: 80
      targetPort: 8080
```

### How it connects

The Service selects pods by `spec.selector`. Matching pod IPs are written into an `EndpointSlice`, and `kube-proxy` programs the node's networking so traffic to the virtual IP is distributed across healthy backends.

Inside the cluster, the service is reachable at `web.<namespace>.svc.cluster.local`.
