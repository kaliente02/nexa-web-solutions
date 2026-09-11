
---

# 9. Development

## `docs/development/architecture.md`

```md
---
title: Architecture
sidebar_position: 1
---

# System Architecture

NEXA systems are designed using modular architecture where appropriate.

## General Architecture

```text
                    ┌──────────────┐
                    │    Client    │
                    └──────┬───────┘
                           │
                           ▼
                    ┌──────────────┐
                    │  Frontend    │
                    └──────┬───────┘
                           │
                           ▼
                    ┌──────────────┐
                    │ API / Server │
                    └──────┬───────┘
                           │
              ┌────────────┼────────────┐
              ▼            ▼            ▼
         ┌─────────┐  ┌─────────┐  ┌─────────┐
         │Database │  │  Queue  │  │  AI/API │
         └─────────┘  └─────────┘  └─────────┘