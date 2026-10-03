---
title: "Start with OpenTelemetry context"
slug: opentelemetry-setup
layout: code
eyebrow: "A small configuration example"
subtitle: "Standard environment variables can configure an instrumented application to export OTLP telemetry."
notes: "This is a starting point, not a complete deployment recipe. Provide the collector or backend endpoint appropriate to your environment. Instrumentation must be installed and initialized in the application; environment variables alone do not create spans or metrics. Use TLS and authentication as required by the deployment."
---

```bash
export OTEL_SERVICE_NAME="ai-assistant"
export OTEL_EXPORTER_OTLP_ENDPOINT="http://otel-collector:4318"
export OTEL_EXPORTER_OTLP_PROTOCOL="http/protobuf"
export OTEL_RESOURCE_ATTRIBUTES="deployment.environment=production"
```

The endpoint is an example placeholder for an OTLP/HTTP receiver reachable by the service. Configure SDK or auto-instrumentation for the application's language, then verify that telemetry arrives and carries the expected service identity.
