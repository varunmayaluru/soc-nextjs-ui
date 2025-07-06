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
  // Default to a high-quality female voice
  DEFAULT_VOICE: "oWAxZDx7w5VEj9dCyTzz", 
  DEFAULT_MODEL: "eleven_multilingual_v2",

  // Voice settings optimized for educational content
  VOICE_SETTINGS: {
    stability: 0.4, // Lower for more expressive speech
    similarityBoost: 0.9, // Higher for better voice consistency
    useSpeakerBoost: true, // Enhanced clarity
    speed: 1.0, // Normal speaking speed
  },

  // Curated female voices for educational content
  FEMALE_VOICES: {
    BELLA: {
      id: "EXAVITQu4vr4xnSDxMaL",
      name: "Bella",
      description: "Young American female - Clear and friendly",
      accent: "American",
      age: "Young",
      recommended: true,
    },
    RACHEL: {
      id: "21m00Tcm4TlvDq8ikWAM",
      name: "Rachel",
      description: "Young American female - Professional and warm",
      accent: "American",
      age: "Young",
      recommended: true,
    },
    DOMI: {
      id: "AZnzlk1XvdvUeBnXmlld",
      name: "Domi",
      description: "Young American female - Energetic and engaging",
      accent: "American",
      age: "Young",
      recommended: false,
    },
    FREYA: {
      id: "jsCqWAovK2LkecY7zXl4",
      name: "Freya",
      description: "Young American female - Calm and soothing",
      accent: "American",
      age: "Young",
      recommended: true,
    },
    GRACE: {
      id: "oWAxZDx7w5VEj9dCyTzz",
      name: "Grace",
      description: "Young American female - Articulate and clear",
      accent: "American",
      age: "Young",
      recommended: false,
    },
    SARAH: {
      id: "EXAVITQu4vr4xnSDxMaL",
      name: "Sarah",
      description: "Middle-aged British female - Authoritative and clear",
      accent: "British",
      age: "Middle-aged",
      recommended: true,
    },
  },

  // All available voices (including male for comparison)
  ALL_VOICES: {
    // Female voices
    BELLA: {
      id: "EXAVITQu4vr4xnSDxMaL",
      name: "Bella",
      description: "Young American female - Clear and friendly",
      gender: "Female",
      accent: "American",
      age: "Young",
      recommended: true,
    },
    RACHEL: {
      id: "21m00Tcm4TlvDq8ikWAM",
      name: "Rachel",
      description: "Young American female - Professional and warm",
      gender: "Female",
      accent: "American",
      age: "Young",
      recommended: true,
    },
    FREYA: {
      id: "jsCqWAovK2LkecY7zXl4",
      name: "Freya",
      description: "Young American female - Calm and soothing",
      gender: "Female",
      accent: "American",
      age: "Young",
      recommended: true,
    },
    // Male voices for comparison
    DANIEL: {
      id: "onwK4e9ZLuTAKqWW03F9",
      name: "Daniel",
      description: "Middle-aged British male - Professional",
      gender: "Male",
      accent: "British",
      age: "Middle-aged",
      recommended: false,
    },
    ADAM: {
      id: "pNInz6obpgDQGcFmaJgB",
      name: "Adam",
      description: "Middle-aged American male - Deep and authoritative",
      gender: "Male",
      accent: "American",
      age: "Middle-aged",
      recommended: false,
    },
  },

  // Voice settings for different content types
  CONTENT_VOICE_SETTINGS: {
    EDUCATIONAL: {
      stability: 0.4,
      similarityBoost: 0.9,
      useSpeakerBoost: true,
      speed: 0.9, // Slightly slower for comprehension
    },
    CONVERSATIONAL: {
      stability: 0.3,
      similarityBoost: 0.8,
      useSpeakerBoost: true,
      speed: 1.0,
    },
    FORMAL: {
      stability: 0.6,
      similarityBoost: 0.9,
      useSpeakerBoost: true,
      speed: 0.95,
    },
  },
}


