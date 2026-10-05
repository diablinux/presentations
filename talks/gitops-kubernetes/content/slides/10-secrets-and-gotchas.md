---
title: "Gotchas to plan for"
slug: gotchas
layout: two-column
eyebrow: "Reality check"
subtitle: "GitOps moves complexity; it does not remove it."
notes: "Never store plain secrets in Git, even in private repositories. Typical options are sealed secrets, SOPS-encrypted files, or an external secrets operator. Choose based on your platform."
---
### Handle with care

- **Secrets:** never commit plain text; use encryption or an external secrets operator
- **Ordering:** CRDs and namespaces must exist before their resources
- **Drift from controllers:** HPAs and operators change fields; ignore them explicitly

---

### Operate it well

- Protect the main branch and require reviews
- Alert on sync failures and out-of-sync apps
- Keep a documented break-glass process for emergencies
- Separate app source from deployment config when teams differ
