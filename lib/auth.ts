// Helper functions for authentication

/**
 * Get the authentication token from localStorage
 */
export function getAuthToken(): string | null {
  if (typeof window !== "undefined") {
    // First try to get the token from localStorage
    const token = localStorage.getItem("authToken")

    if (token) {
      return token
    }

    // If no token in localStorage, try to get from cookie
    const cookies = document.cookie.split(";")
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim()
      if (cookie.startsWith("authToken=")) {
        return cookie.substring("authToken=".length)
      }
    }
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

  // Don't add the Bearer prefix if it's already there
  const authValue = token ? (token.toLowerCase().startsWith("bearer ") ? token : `Bearer ${token}`) : ""

  return {
    Authorization: authValue,
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
    document.cookie = "authToken=; path=/; max-age=0; SameSite=Strict"
    window.location.href = "/login"
  }
}
