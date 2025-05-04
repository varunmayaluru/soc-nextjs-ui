// Helper functions for authentication

/**
 * Get the authentication token from localStorage
 */
export function getAuthToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem("authToken")
  }
  return null
}

/**
 * Check if the user is authenticated
 */
export function isAuthenticated(): boolean {
  return !!getAuthToken()
}

/**
 * Add authentication headers to fetch requests
 */
export function authHeaders(): HeadersInit {
  const token = getAuthToken()
  return {
    Authorization: token ? `Bearer ${token}` : "",
    "Content-Type": "application/json",
  }
}

/**
 * Authenticated fetch function
 */
export async function authFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const headers = {
    ...authHeaders(),
    ...(options.headers || {}),
  }

  return fetch(url, {
    ...options,
    headers,
  })
}

/**
 * Logout function - clear token and redirect
 */
export function logout(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("authToken")
    window.location.href = "/login"
  }
}
