import { getAuthToken } from "./auth";
import { API_CONFIG } from "./config";
import {
  encryptPayload,
  decryptPayload,
  type EncryptedData,
} from "./encryption";

// Types for API responses
export type SecureApiResponse<T> = {
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
 * Makes an authenticated and encrypted API request
 */
export async function secureApiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
  encrypt = true
): Promise<SecureApiResponse<T>> {
  try {
    // Prepare headers with authentication
    const headers = new Headers(options.headers || {});

    // Add authentication
    const token = getAuthToken();
    if (token) {
      const authValue = token.toLowerCase().startsWith("bearer ")
        ? token
        : `Bearer ${token}`;
      headers.set("Authorization", authValue);
      // headers.set("X-OpenAI-API-Key", process.env.NEXT_PUBLIC_OPENAI_API_KEY || "")
    }

    // Set content type
    headers.set("Content-Type", "application/json");
    headers.set("Accept", "application/json");

    // Encrypt payload if needed
    let body = options.body;
    if (encrypt && body && typeof body === "string") {
      try {
        const parsedBody = JSON.parse(body);
        const encryptedPayload = encryptPayload(parsedBody);
        body = JSON.stringify({
          encrypted: true,
          payload: encryptedPayload,
        });
        headers.set("X-Encrypted", "true");
      } catch (error) {
        console.warn("Failed to encrypt payload, sending unencrypted:", error);
      }
    }

    // Make the request
    const url = endpoint.startsWith("http")
      ? endpoint
      : `${API_CONFIG.BASE_URL}${
          endpoint.startsWith("/") ? endpoint : `/${endpoint}`
        }`;

    const response = await fetch(url, {
      ...options,
      headers,
      body,
    });

    // Parse the response
    let data;
    const contentType = response.headers.get("Content-Type") || "";

    if (contentType.includes("application/json")) {
      if (response.status === 204) {
        data = null;
      } else {
        const responseData = await response.json();

        // Check if response is encrypted
        if (responseData.encrypted && responseData.payload) {
          try {
            data = decryptPayload(responseData.payload as EncryptedData);
          } catch (error) {
            console.warn("Failed to decrypt response, using raw data:", error);
            data = responseData;
          }
        } else {
          data = responseData;
        }
      }
    } else {
      data = await response.text();
    }

    return {
      data,
      status: response.status,
      ok: response.ok,
    };
  } catch (error) {
    console.error("Secure API request failed:", error);

    const apiError: ApiError = {
      message:
        error instanceof Error ? error.message : "Unknown error occurred",
      status: 0,
    };

    throw apiError;
  }
}

/**
 * Secure API client with encryption support
 */
export const secureApi = {
  /**
   * GET request (usually no encryption needed for GET)
   */
  get<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<SecureApiResponse<T>> {
    return secureApiRequest<T>(endpoint, { ...options, method: "GET" }, false);
  },

  /**
   * POST request with encryption
   */
  post<T>(
    endpoint: string,
    data: any,
    options: RequestInit = {},
    encrypt = true
  ): Promise<SecureApiResponse<T>> {
    return secureApiRequest<T>(
      endpoint,
      {
        ...options,
        method: "POST",
        body: JSON.stringify(data),
      },
      encrypt
    );
  },

  /**
   * PUT request with encryption
   */
  put<T>(
    endpoint: string,
    data: any,
    options: RequestInit = {},
    encrypt = true
  ): Promise<SecureApiResponse<T>> {
    return secureApiRequest<T>(
      endpoint,
      {
        ...options,
        method: "PUT",
        body: JSON.stringify(data),
      },
      encrypt
    );
  },

  /**
   * DELETE request
   */
  delete<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<SecureApiResponse<T>> {
    return secureApiRequest<T>(
      endpoint,
      { ...options, method: "DELETE" },
      false
    );
  },

  /**
   * PATCH request with encryption
   */
  patch<T>(
    endpoint: string,
    data: any,
    options: RequestInit = {},
    encrypt = true
  ): Promise<SecureApiResponse<T>> {
    return secureApiRequest<T>(
      endpoint,
      {
        ...options,
        method: "PATCH",
        body: JSON.stringify(data),
      },
      encrypt
    );
  },
};
