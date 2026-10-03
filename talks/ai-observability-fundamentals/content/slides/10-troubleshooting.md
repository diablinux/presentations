---
title: "A practical troubleshooting loop"
slug: troubleshooting-loop
layout: bullets
eyebrow: "Put the signals to work"
subtitle: "Begin with a user-visible symptom; narrow the scope before changing the system."
notes: "Use a hypothetical spike in slow answers. Ask learners to follow the steps rather than jump directly to a model change. Preserve a time window and comparison baseline. A rollback, traffic shift, or disabling a feature should follow the team's safety procedures."
reveal: true
---

1. **Define the symptom:** who is affected, when did it start, and what changed?
2. **Check service metrics:** compare request rate, errors, and latency by relevant bounded dimensions.
3. **Inspect representative traces:** find slow or failed operations in the affected window.
4. **Read correlated logs:** look for specific errors and dependency responses, without exposing sensitive payloads.
5. **Check task outcomes:** review appropriate quality or feedback signals alongside operational health.
6. **Mitigate, verify, and learn:** apply a safe change, confirm the signals improve, and record the finding.
