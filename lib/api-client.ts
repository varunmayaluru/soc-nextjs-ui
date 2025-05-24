/**
 * API Client for making authenticated requests
 * This centralizes all API calls and automatically handles authentication
 */

import { getAuthToken } from "./auth";
import { API_CONFIG } from "./config";

// Types for API responses
export type ApiResponse<T> = {
  data: T;
  status: number;
  ok: boolean;
};

export type ApiError = {
  message: string;
  status: number;
  details?: any;
};

/**
 * Makes an authenticated API request
 *
 * @param endpoint - API endpoint (without the base URL)
 * @param options - Fetch options
 * @returns Promise with typed response data
 */
export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    // Prepare headers with authentication
    const headers = new Headers(options.headers || {});

    // Don't add the Bearer prefix if it's already there
    const token = getAuthToken();
    if (token) {
      const authValue = token.toLowerCase().startsWith("bearer ")
        ? token
        : `Bearer ${token}`;
      headers.set("Authorization", authValue);
      headers.set(
        "X-OpenAI-API-Key",
        process.env.NEXT_PUBLIC_OPENAI_API_KEY || ""
      );
    }

    // Set default headers if not provided and not FormData
    if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
      headers.set("Content-Type", "application/json");
    }

    // If the body is FormData, remove Content-Type header to let browser set it
    if (options.body instanceof FormData && headers.has("Content-Type")) {
      headers.delete("Content-Type");
    }

    headers.set("Accept", "application/json");

    // Make the request
    const url = endpoint.startsWith("http")
      ? endpoint
      : `${API_CONFIG.BASE_URL}${
          endpoint.startsWith("/") ? endpoint : `/${endpoint}`
        }`;

    const response = await fetch(url, {
      ...options,
      headers,
    });

    // Parse the response
    let data;
    const contentType = response.headers.get("Content-Type") || "";

    if (contentType.includes("application/json")) {
      if (response.status === 204) {
        data = null;
      } else {
        data = await response.json();
      }
    } else {
      data = await response.text();
    }

    // Return a standardized response
    return {
      data,
      status: response.status,
      ok: response.ok,
    };
  } catch (error) {
    console.error("API request failed:", error);

    // Standardize error format
    const apiError: ApiError = {
      message:
        error instanceof Error ? error.message : "Unknown error occurred",
      status: 0,
    };

    throw apiError;
  }
}

/**
 * API client with methods for common operations
 */
export const api = {
  /**
   * GET request
   */
  get<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    return apiRequest<T>(endpoint, { ...options, method: "GET" });
  },

  /**
   * POST request
   */
  post<T>(
    endpoint: string,
    data: any,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    return apiRequest<T>(endpoint, {
      ...options,
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  /**
   * PUT request
   */
  put<T>(
    endpoint: string,
    data: any,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    return apiRequest<T>(endpoint, {
      ...options,
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  /**
   * DELETE request
   */
  delete<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    return apiRequest<T>(endpoint, { ...options, method: "DELETE" });
  },

  /**
   * PATCH request
   */
  patch<T>(
    endpoint: string,
    data: any,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    return apiRequest<T>(endpoint, {
      ...options,
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },
  /**
   * POST request with FormData
   */
  postFormData<T>(
    endpoint: string,
    formData: FormData,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    // For FormData, we should not manually set Content-Type header
    // The browser will set it automatically with the correct boundary
    const headers = new Headers(options.headers || {});
    if (headers.has("Content-Type")) {
      headers.delete("Content-Type");
    }

    return apiRequest<T>(endpoint, {
      ...options,
      method: "POST",
      body: formData,
      headers,
    });
  },
};
