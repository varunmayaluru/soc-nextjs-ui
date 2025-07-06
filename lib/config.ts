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

// ElevenLabs Configuration
export const ELEVENLABS_CONFIG = {
  DEFAULT_VOICE: "JBFqnCBsd6RMkjVDRZzb", // Rachel voice
  DEFAULT_MODEL: "eleven_multilingual_v2",
  VOICE_SETTINGS: {
    stability: 0.5,
    similarityBoost: 0.8,
    useSpeakerBoost: true,
    speed: 1.0,
  },
  // Available voices with better names
  VOICES: {
    RACHEL: {
      id: "JBFqnCBsd6RMkjVDRZzb",
      name: "Rachel",
      description: "Young American female",
    },
    DREW: {
      id: "29vD33N1CtxCmqQRPOHJ",
      name: "Drew",
      description: "Middle-aged American male",
    },
    CLYDE: {
      id: "2EiwWnXFnvU5JabPnv8n",
      name: "Clyde",
      description: "Middle-aged American male",
    },
    DAVE: {
      id: "CYw3kZ02Hs0563khs1Fj",
      name: "Dave",
      description: "Young British male",
    },
    FIN: {
      id: "D38z5RcWu1voky8WS1ja",
      name: "Fin",
      description: "Old Irish male",
    },
    FREYA: {
      id: "jsCqWAovK2LkecY7zXl4",
      name: "Freya",
      description: "Young American female",
    },
    GRACE: {
      id: "oWAxZDx7w5VEj9dCyTzz",
      name: "Grace",
      description: "Young American female",
    },
    DANIEL: {
      id: "onwK4e9ZLuTAKqWW03F9",
      name: "Daniel",
      description: "Middle-aged British male",
    },
  },
}


