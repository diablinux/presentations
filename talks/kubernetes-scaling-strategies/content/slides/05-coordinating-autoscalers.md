---
title: HPA and Node Autoscaling Work Together
slug: coordinating-autoscalers
layout: diagram
eyebrow: One demand signal, two control loops
flow: [Demand rises, HPA adds pods, Pods need capacity, Add nodes]
notes: "Walk through the dependency: HPA can raise desired replicas before the cluster has room to schedule them. The node autoscaler may then add capacity, subject to provider and scheduling constraints. When demand falls, pod and node scale-down are separate decisions."
---

The HPA scales workload replicas. The node autoscaler responds when those replicas cannot fit.
