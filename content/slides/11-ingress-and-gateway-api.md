---
title: "Ingress & Gateway API"
slug: "ingress-and-gateway-api"
layout: two-column
eyebrow: "Networking"
subtitle: "One entry point, many services. HTTP(S) routing, host/path matching and TLS termination."
flow:
  - Internet
  - Ingress Controller
  - Service
  - Pods
notes: ""
section: true
---

### Ingress example

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: web
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  ingressClassName: nginx
  tls:
    - hosts:
        - app.example.com
      secretName: app-tls
  rules:
    - host: app.example.com
      http:
        paths:
          - path: /api
            pathType: Prefix
            backend:
              service:
                name: api
                port:
                  number: 80
```

---

### How it fits together

1. Internet
2. Ingress Controller (nginx, Traefik, Envoy…)
3. Service
4. Pods

The **Ingress** object is just a spec — nothing happens without an **Ingress Controller** running in the cluster. For richer L4/L7 routing, the `Gateway API` is the direction of travel.
