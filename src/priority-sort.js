export class RequestSortError extends Error {
  constructor(message) {
    super(message);
    this.name = "RequestSortError";
  }
}

const RANK = { High: 0, Medium: 1, Normal: 1, Low: 2 };

export function sortRequestsByPriority(requests) {
  for (const [index, request] of requests.entries()) {
    const label = request?.id || request?.equipment || `position ${index + 1}`;
    if (!Object.hasOwn(RANK, request?.priority)) {
      throw new RequestSortError(`Cannot sort: request "${label}" has missing or invalid priority.`);
    }
    if (
      typeof request.neededBy !== "string" ||
      !/^\\d{4}-\\d{2}-\\d{2}$/.test(request.neededBy) ||
      !Number.isFinite(Date.parse(request.neededBy + "T00:00:00Z")) ||
      new Date(request.neededBy + "T00:00:00Z").toISOString().slice(0, 10) !== request.neededBy
    ) {
      throw new RequestSortError(`Cannot sort: request "${label}" has missing or invalid needed-by date.`);
    }
  }

  return requests.map((request, index) => ({ request, index }))
    .sort((a, b) =>
      RANK[a.request.priority] - RANK[b.request.priority] ||
      a.request.neededBy.localeCompare(b.request.neededBy) ||
      a.index - b.index
    ).map(({ request }) => request);
}
