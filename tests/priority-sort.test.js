import assert from "node:assert/strict";
import test from "node:test";
import { RequestSortError, sortRequestsByPriority } from "../src/priority-sort.js";

const request = (id, priority, neededBy, createdAt = "2026-10-01T10:00:00.000Z") =>
  ({ id, priority, neededBy, createdAt });
const early = "2026-10-01";
const late = "2026-10-05";

test("AC1/AC2: priority groups then earliest needed-by date first, not submission date", () => {
  const input = [
    request("low", "Low", early),
    request("high-later", "High", late, "2026-09-01T10:00:00.000Z"),
    request("medium", "Medium", early),
    request("normal", "Normal", late),
    request("high-earlier", "High", early, "2026-10-10T10:00:00.000Z"),
  ];
  assert.deepEqual(sortRequestsByPriority(input).map(x => x.id),
    ["high-earlier", "high-later", "medium", "normal", "low"]);
});

test("AC3: equal priority and needed-by date preserve original order", () => {
  const input = [request("first", "High", early), request("second", "High", early)];
  assert.deepEqual(sortRequestsByPriority(input), input);
});

test("AC4: missing or invalid priority identifies request and preserves source", () => {
  for (const priority of [undefined, "Urgent"]) {
    const input = [request("broken", priority, early)];
    const snapshot = structuredClone(input);
    assert.throws(() => sortRequestsByPriority(input), error =>
      error instanceof RequestSortError && /broken/.test(error.message) && /priority/.test(error.message));
    assert.deepEqual(input, snapshot);
  }
});

test("AC5: missing or invalid needed-by dates identify request", () => {
  for (const date of ["", "not-a-date", undefined, "2026-02-30", "2026-13-01"]) {
    assert.throws(() => sortRequestsByPriority([request("bad-date", "High", date)]),
      error => error instanceof RequestSortError && /bad-date/.test(error.message) && /needed-by date/.test(error.message));
  }
});

test("AC6: sorting does not modify requests or original order", () => {
  const input = [request("low", "Low", early), request("high", "High", late)];
  const snapshot = structuredClone(input);
  assert.deepEqual(sortRequestsByPriority(input).map(x => x.id), ["high", "low"]);
  assert.deepEqual(input, snapshot);
});

test("AC7: empty list sorts safely", () => {
  assert.deepEqual(sortRequestsByPriority([]), []);
});

test("AC8: sorter works with plain in-memory records", () => {
  assert.equal(sortRequestsByPriority([request("one", "High", early)]).length, 1);
});

test("Normal is treated as Medium without changing stored records", () => {
  const input = [request("normal", "Normal", early), request("medium", "Medium", late)];
  assert.deepEqual(sortRequestsByPriority(input).map(x => x.id), ["normal", "medium"]);
  assert.equal(input[0].priority, "Normal");
});

test("submission timestamp does not need to be valid for needed-by sorting", () => {
  assert.deepEqual(sortRequestsByPriority([request("one", "High", early, "legacy")]).map(x => x.id), ["one"]);
});
