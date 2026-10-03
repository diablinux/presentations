---
title: "AI features need outcome-aware signals"
slug: ai-specific-signals
layout: bullets
eyebrow: "Beyond availability"
subtitle: "Operational success and useful results are related—but not identical."
notes: "Examples depend on product and task. Define quality measures with domain owners and validate them; automated evaluators are not ground truth. Avoid collecting raw prompts and completions as a default observability strategy."
section: true
---

- **Service behavior:** request volume, errors, timeouts, and end-to-end latency.
- **Model interaction:** selected model/version, retry outcome, and usage measures where exposed.
- **Retrieval or tool use:** dependency latency, empty results, and tool success/failure.
- **Task outcome:** reviewed quality samples, groundedness checks, or task-specific feedback.

Record only the attributes needed for diagnosis. Keep secrets and sensitive user content out of routine telemetry.
