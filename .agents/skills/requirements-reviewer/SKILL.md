---
name: requirements-reviewer
description: Review a feature specification against repository implementation and tests. Use when asked to check acceptance criteria, identify implementation gaps or unsupported behavior, assess data and security concerns, or recommend missing tests. Produce evidence-backed findings without changing files unless explicitly requested.
---

# Requirements Reviewer

Review the requested feature on the current repository branch. Remain read-only unless the user explicitly asks for edits.

## Procedure

1. Identify the feature specification, acceptance criteria, relevant implementation, and tests. Ask for a missing specification or its location rather than inventing requirements.
2. Read the specification and enumerate each criterion with a stable identifier and precise source location.
3. Trace each criterion to actual code paths and tests. Inspect validation, error paths, persistence, authorization, and boundary conditions as relevant. Do not assume that a test's existence proves correctness.
4. Report **satisfied acceptance criteria**, **gaps**, **unsupported behavior** (implementation that exceeds or conflicts with the specification), **data or security concerns**, and **tests still needed**. Include an explicit "None identified" when a category has no findings.
5. Cite evidence for every substantive finding: specification path and heading/line(s), implementation path and line(s) or symbol, and test path and test name when relevant. Quote only short necessary excerpts. If line numbers are unavailable, use file paths plus uniquely identifiable headings/functions and state that limitation.
6. Classify each criterion as Satisfied, Partially satisfied, Not satisfied, or Not verifiable. Distinguish observed facts from inferences. Never claim a behavior is absent without checking relevant paths; describe search scope and uncertainty.
7. Rank gaps and risks by severity (high/medium/low) and recommend concrete, minimal tests, including negative and edge cases. State whether tests were actually executed and their results; never imply unrun tests passed.

## Report format

- **Scope and evidence:** specification, branch/commit, implementation and test files inspected; execution limitations.
- **Acceptance criteria matrix:** criterion ID, requirement with spec citation, status, code/test evidence, short explanation.
- **Gaps:** severity, expected vs. observed, citations, suggested correction.
- **Unsupported behavior:** behavior, evidence, why not authorized by specification.
- **Data/security concerns:** impact, evidence, and mitigation; distinguish confirmed issues from potential risks.
- **Tests still needed:** scenario, expected result, target test location, related criterion.
- **Summary:** totals by status and most important next steps.

Do not modify source, tests, specifications, or configuration; do not create commits or pull requests unless explicitly asked.