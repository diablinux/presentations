---
title: "Push versus pull delivery"
slug: pull-vs-push
layout: comparison
eyebrow: "Mental model"
subtitle: "Who holds the cluster credentials changes the security story."
notes: "Pull is not automatically more secure, but it removes the need to expose cluster credentials to external CI. Push pipelines are still valid for building and testing artifacts."
---
### Push (classic CI/CD)

- Pipeline runs `kubectl apply`
- CI needs credentials to the cluster
- Drift goes unnoticed until the next run
- State lives in pipeline logs

---

### Pull (GitOps)

- In-cluster agent fetches from Git
- Cluster credentials stay inside the cluster
- Drift is detected and can be corrected
- State lives in Git history
