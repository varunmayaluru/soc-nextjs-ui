// Helper functions for authentication

/**
 * Get the authentication token from localStorage
 */
export function getAuthToken(): string | null {
  if (typeof window !== "undefined") {
    // First try to get the token from localStorage
    const token = localStorage.getItem("authToken");

    if (token) {
      return token;
    }

    // If no token in localStorage, try to get from cookie
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.startsWith("authToken=")) {
        return cookie.substring("authToken=".length);
      }
    }
  }
  return null;
}

/**
 * Check if the token is expired
 */
export function isTokenExpired(token: string | null): boolean {
  if (!token) return true;

  try {
    // For tokens that already have the Bearer prefix
    const tokenValue = token.startsWith("Bearer ")
      ? token.split(" ")[1]
      : token;

    // Decode the token
    const base64Url = tokenValue.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );

    const { exp } = JSON.parse(jsonPayload);

    // Check if the token is expired
    if (!exp) return false;

    // Convert exp to milliseconds and compare with current time
    return Date.now() >= exp * 1000;
  } catch (error) {
    console.error("Error checking token expiration:", error);
    return true; // If there's an error parsing the token, consider it expired
  }
}

/**
 * Check if the user is authenticated with a valid token
 */
export function isAuthenticated(): boolean {
  const token = getAuthToken();
  return !!token && !isTokenExpired(token);
}

/**
 * Add authentication headers to fetch requests
 */
export function authHeaders(): HeadersInit {
  const token = getAuthToken();

  // Don't add the Bearer prefix if it's already there
  const authValue = token
    ? token.toLowerCase().startsWith("bearer ")
      ? token
      : `Bearer ${token}`
    : "";

  return {
    Authorization: authValue,
    "Content-Type": "application/json",
  };
}

/**
 * Authenticated fetch function
 */
export async function authFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const headers = {
    ...authHeaders(),
    ...(options.headers || {}),
  };

  return fetch(url, {
    ...options,
    headers,
  });
}

/**
 * Logout function - clear token and redirect
 */
export function logout(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("authToken");
    document.cookie = "authToken=; path=/; max-age=0; SameSite=Strict";
    window.location.href = "/login";
  }
}
