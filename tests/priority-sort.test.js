import assert from "node:assert/strict";
import test from "node:test";
import { RequestSortError, sortRequestsByPriority } from "../src/priority-sort.js";

const request = (id, priority, createdAt) => ({ id, priority, createdAt });
const early = "2026-10-01T10:00:00.000Z";
const late = "2026-10-05T10:00:00.000Z";

test("AC1/AC2: priority groups then oldest first", () => {
  const input = [
    request("low", "Low", early),
    request("high-new", "High", late),
    request("medium", "Medium", early),
    request("normal", "Normal", late),
    request("high-old", "High", early),
  ];
  assert.deepEqual(sortRequestsByPriority(input).map(x => x.id),
    ["high-old", "high-new", "medium", "normal", "low"]);
});

test("AC3: tied priority and timestamp preserve original order", () => {
  const input = [request("first", "High", early), request("second", "High", early)];
  assert.deepEqual(sortRequestsByPriority(input), input);
});

test("AC4: invalid or missing priority identifies request and preserves source", () => {
  for (const priority of [undefined, "Urgent"]) {
    const input = [request("broken", priority, early)];
    const snapshot = structuredClone(input);
    assert.throws(() => sortRequestsByPriority(input), error =>
      error instanceof RequestSortError && /broken/.test(error.message) && /priority/.test(error.message));
    assert.deepEqual(input, snapshot);
  }
});

test("AC5: missing or invalid dates identify request", () => {
  for (const date of ["", "not-a-date", undefined]) {
    assert.throws(() => sortRequestsByPriority([request("bad-date", "High", date)]),
      error => error instanceof RequestSortError && /bad-date/.test(error.message) && /date/.test(error.message));
  }
});

test("AC6: sorting never changes records or original order", () => {
  const input = [request("low", "Low", early), request("high", "High", late)];
  const snapshot = structuredClone(input);
  assert.deepEqual(sortRequestsByPriority(input).map(x => x.id), ["high", "low"]);
  assert.deepEqual(input, snapshot);
  assert.deepEqual(input.map(x => x.id), ["low", "high"]);
});

test("AC7: empty list sorts safely", () => {
  assert.deepEqual(sortRequestsByPriority([]), []);
});

test("AC8: sorter works with plain in-memory records", () => {
  assert.deepEqual(sortRequestsByPriority([request("one", "High", early)]).length, 1);
});

test("Normal is treated as Medium without changing stored records", () => {
  const input = [request("normal", "Normal", early), request("medium", "Medium", late)];
  assert.deepEqual(sortRequestsByPriority(input).map(x => x.id), ["normal", "medium"]);
  assert.equal(input[0].priority, "Normal");
});
