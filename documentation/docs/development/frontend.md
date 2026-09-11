
---

## `docs/development/frontend.md`

```md
---
title: Frontend Development
sidebar_position: 2
---

# Frontend Development

NEXA frontend applications focus on usability, performance, and maintainability.

## Technologies

Common technologies include:

- React
- JavaScript
- TypeScript
- HTML
- CSS
- Bootstrap
- Inertia.js

## Frontend Responsibilities

The frontend is responsible for:

- User interfaces
- Navigation
- Forms
- Client-side validation
- API communication
- Data visualization
- User feedback

## Example

```js
async function loadCustomers() {
  const response = await fetch('/api/customers');

  if (!response.ok) {
    throw new Error('Unable to load customers');
  }

  return response.json();
}