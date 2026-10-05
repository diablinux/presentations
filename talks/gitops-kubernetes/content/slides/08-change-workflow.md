---
title: "A change, end to end"
slug: change-workflow
layout: bullets
reveal: true
eyebrow: "Workflow"
subtitle: "Every change is a reviewed pull request."
notes: "Step through one at a time. Rollback is a git revert, which goes through the same flow. Image updates can be automated by bots that open pull requests."
---
1. Open a pull request that changes a manifest or image tag
2. CI validates it: lint, schema checks, policy tests
3. A reviewer approves and merges to the main branch
4. The in-cluster agent detects the new commit and syncs
5. Health checks confirm the rollout; roll back with `git revert`
