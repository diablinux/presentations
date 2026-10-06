---
title: Choose a Metric That Tracks Demand
slug: selecting-metrics
layout: cards
eyebrow: Scale on the bottleneck
notes: "Metric choice depends on the service architecture and how the signal is exposed. Custom metrics require an appropriate metrics pipeline and adapter. Queue workers often need a per-worker backlog target rather than CPU alone."
---

## CPU

Useful when compute demand rises with traffic; requires meaningful CPU requests.

## Queue backlog

Useful for workers; relate pending work to processing capacity and queue age.

## Request rate

Useful when throughput per replica is predictable and the metric pipeline is reliable.

## Latency

Useful as a service objective, but investigate whether adding replicas can relieve its cause.
