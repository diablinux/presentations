---
title: "ConfigMaps & Secrets"
slug: "configmaps-and-secrets"
layout: two-column
eyebrow: "Configuration"
subtitle: "Decouple configuration and credentials from your container images — the same image, many environments."
notes: ""
section: false
---

### Configuration objects

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  LOG_LEVEL: "info"
  API_URL: "https://api.internal"
---
apiVersion: v1
kind: Secret
metadata:
  name: db-credentials
type: Opaque
stringData:
  password: "s3cr3t"
```

---

### Consume as environment variables

```yaml
envFrom:
  - configMapRef:
      name: app-config
  - secretRef:
      name: db-credentials
```

### Or mount as files

```yaml
volumeMounts:
  - name: config
    mountPath: /etc/app
volumes:
  - name: config
    configMap:
      name: app-config
```

> **Secrets are not magic.** By default they are only base64-encoded. Enable encryption at rest in etcd, lock down RBAC, and prefer an external manager (Vault, SOPS, cloud KMS) for real workloads.
