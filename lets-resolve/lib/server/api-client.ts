import { getAccessToken } from "@/utils/amplify-server-utils";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = "ApiError";
  }
}

async function authHeaders(): Promise<Record<string, string>> {
  const token = await getAccessToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function toApiError(response: Response): Promise<ApiError> {
  try {
    const data = await response.json();
    return new ApiError(response.status, data?.error ?? response.statusText);
  } catch {
    return new ApiError(response.status, response.statusText || "Request failed");
  }
}

function buildUrl(path: string, searchParams?: Record<string, string | undefined>): string {
  const url = new URL(path, API_BASE_URL);
  if (searchParams) {
    for (const [key, value] of Object.entries(searchParams)) {
      if (value !== undefined) url.searchParams.set(key, value);
    }
  }
  return url.toString();
}

export async function apiGet<T>(
  path: string,
  searchParams?: Record<string, string | undefined>
): Promise<T> {
  const response = await fetch(buildUrl(path, searchParams), {
    headers: await authHeaders(),
    cache: "no-store",
  });
  if (!response.ok) throw await toApiError(response);
  return response.json() as Promise<T>;
}

/**
 * POST/PUT/DELETE against the API. `body` can be a `FormData` (ticket and
 * article attachments go through multer on the API side, so those requests
 * stay multipart) or a plain object, which is sent as JSON.
 */
export async function apiSend<T>(
  path: string,
  method: "POST" | "PUT" | "DELETE",
  body?: FormData | Record<string, unknown>
): Promise<T> {
  const headers = await authHeaders();
  const isFormData = body instanceof FormData;

  const response = await fetch(buildUrl(path), {
    method,
    headers: isFormData || !body ? headers : { ...headers, "Content-Type": "application/json" },
    body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
  });

  if (!response.ok) throw await toApiError(response);
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}
