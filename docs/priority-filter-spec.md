# Priority Sorting Feature Specification

## Goal
Help managers identify equipment requests needing attention faster by sorting existing requests by priority and age, without changing request data.

## User Need
As a manager, I want to sort equipment requests with the highest priority first and the oldest request first within each priority, so I can address urgent and long-waiting requests quickly.

## Functional Rules
1. Provide a user-selectable priority sort and a way to return to the original request order.
2. When selected, show all valid requests grouped in this order: High, Medium, Low. Existing `Normal` priorities are treated and displayed as `Medium` for compatibility; the stored value is not changed.
3. Within each priority group, sort by the existing request submission date/time, oldest first.
4. For requests with equal priority and submission timestamp, preserve their original relative order.
5. Sorting changes only the displayed order; it does not modify, remove, or create request records.
6. If any request has missing or unrecognized priority information (other than the supported legacy `Normal` value), show a clear error identifying the affected request. Do not guess or change its priority; leave the original unsorted view accessible. Do not present a misleading partially sorted result.
7. If any request has a missing or invalid submission date/time, show a clear error identifying the affected request. Do not guess its age; leave the original unsorted view accessible.
8. If no requests exist, display an appropriate empty state without an error or crash.

## Constraints
- Use existing request priority and submission-date information; do not introduce new priority categories.
- No login, authentication requirement, or database.
- Preserve all existing requests and their values, including records with invalid fields.
- Do not change the underlying data or its original order; sorting is a display-only operation.
- Do not break existing application behavior.

## Acceptance Criteria
- **AC1 — Priority order:** Given High, Medium, and Low requests with valid dates, when priority sort is selected, then every High request precedes every Medium request, and every Medium request precedes every Low request.
- **AC2 — Oldest first:** Given two requests with the same priority and different valid submission dates, when sorted, then the earlier submitted request appears first.
- **AC3 — Stable ties:** Given two requests with identical priority and timestamp, when sorted, then they retain their original relative order.
- **AC4 — Invalid priority:** Given a request with missing or unrecognized priority, when sorting is attempted, then an error identifies that request, no replacement priority is assigned, and the original list remains accessible.
- **AC5 — Invalid date:** Given a request with missing or invalid submission date, when sorting is attempted, then an error identifies that request and the original list remains accessible without a guessed date.
- **AC6 — Preservation:** Given an existing list, when a manager sorts and then returns to the original view, then every request and all its fields are unchanged and the original display order is restored.
- **AC7 — Empty list:** Given zero requests, when sorting is selected, then the application displays an empty-state message and does not crash.
- **AC8 — No infrastructure dependency:** Given the existing application setup, when sorting is used, then it works without login or database.
- **AC9 — Completion:** Automated tests cover AC1–AC8, and existing tests continue to pass. Managers can use sorting and return to the original view.

## Out of Scope
- Implementing the feature as part of this specification task.
- Filtering or hiding requests by priority.
- Creating, editing, or deleting requests or priority values.
- Adding authentication, a database, or new persistent storage.
- New priority categories, notifications, or reminders.
- Displaying the number of days an equipment request has been awaiting review. This feature focuses on sorting requests by priority and submission date, not tracking or displaying how long requests have remained unreviewed.
