---
title: "Metrics show patterns and change"
slug: metrics
layout: bullets
eyebrow: "Signal 1 · Metrics"
subtitle: "Start with measures that reflect user experience and system health."
notes: "A metric is a numeric measurement recorded over time. Histograms can support latency distributions and percentiles when the instrumentation and backend retain suitable buckets. Avoid treating an average as a complete picture."
---

- **Request rate:** how much traffic is arriving?
- **Error rate:** what fraction of requests fail or time out?
- **Latency distribution:** are typical and slow requests changing?
- **Resource pressure:** is a constrained dependency or worker saturating?

Use labels with care: unbounded values such as request IDs or raw prompts can create huge numbers of time series.
