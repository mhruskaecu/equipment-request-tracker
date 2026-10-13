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
      typeof request.createdAt !== "string" ||
      !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/.test(request.createdAt) ||
      !Number.isFinite(Date.parse(request.createdAt))
    ) {
      throw new RequestSortError(`Cannot sort: request "${label}" has missing or invalid submission date.`);
    }
  }

  return requests.map((request, index) => ({ request, index }))
    .sort((a, b) =>
      RANK[a.request.priority] - RANK[b.request.priority] ||
      Date.parse(a.request.createdAt) - Date.parse(b.request.createdAt) ||
      a.index - b.index
    ).map(({ request }) => request);
}
