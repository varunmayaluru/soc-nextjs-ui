/**
 * Application configuration
 * Centralizes all environment variables and configuration settings
 */

// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api/v1",
  TIMEOUT: 30000, // 30 seconds
}

// Authentication Configuration
export const AUTH_CONFIG = {
  TOKEN_STORAGE_KEY: "authToken",
  TOKEN_COOKIE_NAME: "authToken",
  TOKEN_COOKIE_MAX_AGE: 60 * 60 * 24 * 7, // 7 days
}

// Other app-wide configuration
export const APP_CONFIG = {
  APP_NAME: "ProbEd",
  SUPPORT_EMAIL: "support@probed.com",
}
