---
title: "Why deployments go wrong"
slug: why-gitops
layout: bullets
eyebrow: "The problem"
subtitle: "Manual and imperative delivery is hard to repeat and hard to audit."
notes: "Ask who has run kubectl apply against production by hand. These pain points are common, not universal; every team's mix differs."
---
- **Drift:** the live cluster slowly diverges from what was intended
- **No audit trail:** hard to answer who changed what, and why
- **Risky rollbacks:** undoing a change means a new manual procedure
- **Wide access:** CI systems and people hold cluster credentials
- **Snowflake environments:** staging and production differ in unknown ways
