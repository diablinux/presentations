---
title: "Key takeaways"
slug: takeaways
layout: bullets
eyebrow: "Summary"
subtitle: "Start small and grow."
notes: "Suggest a first step: pick one non-critical service, put its manifests in Git, and let an agent sync it to a test cluster."
---
- Git holds the desired state; the cluster pulls and reconciles it
- Pull requests become the change, review and audit mechanism
- Rollback is a revert and drift is detected automatically
- Treat secrets, ordering and access as design decisions
- Begin with one service in a test cluster
