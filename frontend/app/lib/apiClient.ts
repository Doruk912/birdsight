/**
 * apiClient
 *
 * A thin fetch wrapper that:
 *  1. Injects the current access token as a Bearer header.
 *  2. On a 401 response, attempts a silent token refresh and retries once.
 *  3. Stores the access token in memory only (never localStorage/sessionStorage).
 *  4. Refresh token is sent via httpOnly cookie — the browser handles it automatically.
 */

// In-memory access token store — survives re-renders, cleared on tab close.
let _accessToken: string | null = null;

export const tokenStore = {
  get: () => _accessToken,
  set: (token: string | null) => {
    _accessToken = token;
  },
  clear: () => {
    _accessToken = null;
  },
};

type RequestOptions = Omit<RequestInit, "headers"> & {
  headers?: Record<string, string>;
  skipAuth?: boolean;
};

async function request<T>(
  url: string,
  options: RequestOptions = {},
): Promise<T> {
  const { skipAuth = false, headers = {}, ...rest } = options;
  const token = tokenStore.get();

  const isFormData = rest.body instanceof FormData;

  const response = await fetch(url, {
    ...rest,
    credentials: "include",
    headers: {
      ...(!isFormData ? { "Content-Type": "application/json" } : {}),
      ...(!skipAuth && token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  });

  if (response.status === 401 && !skipAuth) {
    const refreshed = await tryRefresh();
    if (refreshed) return request<T>(url, options);
    tokenStore.clear();
    throw new ApiError(401, "Session expired. Please log in again.");
  }

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    let message: string = body?.message ?? response.statusText;
    if (body?.validationErrors && typeof body.validationErrors === "object") {
      const details = Object.values(
        body.validationErrors as Record<string, string>,
      ).join("; ");
      if (details) message = `${message}: ${details}`;
    }
    throw new ApiError(response.status, message);
  }

  if (response.status === 204) return undefined as T;

  return response.json() as Promise<T>;
}

async function tryRefresh(): Promise<boolean> {
  try {
    const res = await fetch("/api/auth/refresh", {
      method: "POST",
      credentials: "include",
    });
    if (!res.ok) return false;
    const data = await res.json();
    if (data?.accessToken) {
      tokenStore.set(data.accessToken);
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

export class ApiError extends Error {
  public status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export const apiClient = {
  get: <T>(url: string, options?: RequestOptions) =>
    request<T>(url, { method: "GET", ...options }),

  post: <T>(url: string, body: unknown, options?: RequestOptions) =>
    request<T>(url, { method: "POST", body: JSON.stringify(body), ...options }),

  postForm: <T>(url: string, formData: FormData, options?: RequestOptions) => {
    const { headers = {}, ...rest } = options ?? {};
    return request<T>(url, {
      method: "POST",
      body: formData,
      headers,
      ...rest,
    });
  },

  putForm: <T>(url: string, formData: FormData, options?: RequestOptions) => {
    const { headers = {}, ...rest } = options ?? {};
    return request<T>(url, {
      method: "PUT",
      body: formData,
      headers,
      ...rest,
    });
  },

  put: <T>(url: string, body: unknown, options?: RequestOptions) =>
    request<T>(url, { method: "PUT", body: JSON.stringify(body), ...options }),

  delete: <T>(url: string, options?: RequestOptions) =>
    request<T>(url, { method: "DELETE", ...options }),
};
