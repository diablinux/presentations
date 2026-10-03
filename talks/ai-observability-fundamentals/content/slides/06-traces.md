---
title: "Traces follow work across services"
slug: traces
layout: diagram
eyebrow: "Signal 3 · Traces"
subtitle: "A trace connects timed operations so you can see where a request went."
flow:
  - Client request
  - Application
  - Retrieval or tool
  - Model endpoint
notes: "Each node represents a possible operation, not a required architecture. A span can record duration, status, and selected attributes. Distributed trace propagation requires compatible instrumentation and context propagation; missing instrumentation can make a trace incomplete."
---

- A **trace** groups the work associated with one operation.
- A **span** records one timed operation and its relationship to other spans.
- Parent-child timing helps distinguish application time from dependency time.

The diagram is illustrative: a real request can follow a different path or skip steps.
