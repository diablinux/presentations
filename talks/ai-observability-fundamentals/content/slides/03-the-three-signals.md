---
title: "Three signals, different questions"
slug: three-signals
layout: two-column
eyebrow: "A simple mental model"
subtitle: "Use each signal for the question it answers best."
notes: "Metrics are aggregated measurements, logs are time-stamped event records, and traces describe work across a request path. They complement one another; no single signal replaces the others."
---

### Metrics

**How much? How often? How long?**

- Trends and rates over time
- Counters, gauges, and histograms
- Efficient alerting and service-level views

---

### Logs

**What happened in this specific event?**

- Time-stamped records with context
- Useful for errors and unusual conditions
- Best when fields are structured and consistent

### Traces

**Where did this request spend its time?**

- Connected operations (spans) for one request
- Timing and parent-child relationships
- Helpful for locating slow or failing dependencies
