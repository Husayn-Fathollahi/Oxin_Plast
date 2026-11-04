/**
 * Central HTTP client used by all feature API modules.
 *
 * - Reads the API base URL from the NEXT_PUBLIC_API_BASE_URL environment variable.
 * - Returns typed response objects: { data, status }.
 * - Throws a structured error with a `status` property for HTTP error responses.
 *
 * NOTE: This is a lightweight fetch wrapper intentionally kept framework-agnostic.
 *       Replace with axios if interceptors or request cancellation are needed.
 */

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3001/api/v1';

export interface ApiResponse<T> {
  data: T;
  status: number;
}

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
  headers: Record<string, string> = {},
): Promise<ApiResponse<T>> {
  const url = `${BASE_URL}${path}`;
  const response = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    ...(body !== undefined && { body: JSON.stringify(body) }),
    // Next.js cache: revalidate at most every 60 seconds for SSR pages
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    throw new ApiError(response.status, `API error: ${response.status} ${response.statusText}`);
  }

  const data: T = await response.json();
  return { data, status: response.status };
}

export const apiClient = {
  get: <T>(path: string, headers?: Record<string, string>) =>
    request<T>('GET', path, undefined, headers),

  post: <T>(path: string, body: unknown, headers?: Record<string, string>) =>
    request<T>('POST', path, body, headers),

  patch: <T>(path: string, body: unknown, headers?: Record<string, string>) =>
    request<T>('PATCH', path, body, headers),

  delete: <T>(path: string, headers?: Record<string, string>) =>
    request<T>('DELETE', path, undefined, headers),
};
