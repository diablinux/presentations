---
title: Migration Toolkit for Virtualization
slug: tooling
layout: comparison
eyebrow: Tooling
section: true
notes: The Migration Toolkit for Virtualization is Red Hat's supported tool, based on the upstream Forklift project. It connects to the source, builds a plan, and moves VMs. Check which source versions and guest operating systems are supported.
---
## Core concepts

- Provider: source and target
- Network and storage maps
- Migration plan
- Run VMs in waves

---

## Methods

- Cold: VM powered off, simplest
- Warm: data copied while VM runs, short cutover
- Check support for each source and guest OS
