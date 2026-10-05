---
title: "The reconciliation loop"
slug: reconciliation-loop
layout: diagram
eyebrow: "Mechanics"
flow: [Git commit, Agent fetches, Compare, Apply, Report status]
subtitle: "The controller repeats this cycle continuously."
notes: "Walk left to right and then loop back. The compare step is what detects drift, including manual kubectl edits. Reconciliation intervals are configurable and vary by tool."
---
Desired state comes from Git. Observed state comes from the API server. Any difference is corrected, or reported when automated sync is disabled.
