---
title: Examples — Basic to Intermediate
sidebar_position: 0
slug: /tutorials/examples/
---

# Examples — Basic to Intermediate

These examples grow one external application through the current
`appcore-sdk` facade. Every stage keeps the three owned artifacts: Application
Manifest, Deployment Manifest, and business code.

| Level | Example | Main lesson |
| --- | --- | --- |
| 1 | [Smallest local application](./standalone-ping) | Validate canonical local manifests and logging |
| 2 | [Application registration](./command-event-query) | Register business contracts without constructing infrastructure |
| 3 | [Scheduled task contract](./scheduled-task) | Declare bounded work for a deployment-owned scheduler |
| 4 | [Standalone to cluster](./standalone-to-cluster) | Keep business code unchanged while deployment policy changes |

Start with `appcore-sdk = "1.0.0-rc.1"`. Enable only the features used by the
application. None of these examples creates an implicit host or Runtime CLI.
