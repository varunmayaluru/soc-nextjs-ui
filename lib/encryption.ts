import crypto from "crypto"

const algorithm = "aes-256-gcm"
const secretKey = process.env.ENCRYPTION_SECRET_KEY || "your-32-character-secret-key-here!" // Must be 32 bytes

// Ensure the secret key is exactly 32 bytes
function getSecretKey(): Buffer {
  const key = secretKey.padEnd(32, "0").substring(0, 32)
  return Buffer.from(key, "utf8")
}

export interface EncryptedData {
  encrypted: string
  iv: string
  authTag: string
}

/**
 * Encrypts a payload using AES-256-GCM
 * @param data - The data to encrypt (will be JSON stringified)
 * @returns Encrypted data with IV and auth tag
 */
export function encryptPayload(data: any): EncryptedData {
  try {
    const iv = crypto.randomBytes(16) // Generate random IV for each encryption
    const cipher = crypto.createCipheriv(algorithm, getSecretKey(), iv)

    const jsonData = JSON.stringify(data)
    let encrypted = cipher.update(jsonData, "utf8", "hex")
    encrypted += cipher.final("hex")

    const authTag = cipher.getAuthTag()

    return {
      encrypted,
      iv: iv.toString("hex"),
      authTag: authTag.toString("hex"),
    }
  } catch (error) {
    console.error("Encryption error:", error)
    throw new Error("Failed to encrypt payload")
  }
}

/**
 * Decrypts a payload using AES-256-GCM
 * @param encryptedData - The encrypted data object
 * @returns Decrypted and parsed data
 */
export function decryptPayload(encryptedData: EncryptedData): any {
  try {
    const { encrypted, iv, authTag } = encryptedData

    const decipher = crypto.createDecipheriv(algorithm, getSecretKey(), Buffer.from(iv, "hex"))
    decipher.setAuthTag(Buffer.from(authTag, "hex"))

    let decrypted = decipher.update(encrypted, "hex", "utf8")
    decrypted += decipher.final("utf8")

    return JSON.parse(decrypted)
  } catch (error) {
    console.error("Decryption error:", error)
    throw new Error("Failed to decrypt payload")
  }
}

/**
 * Client-side encryption utility (for browser)
 * Uses Web Crypto API for client-side encryption
 */
export class ClientEncryption {
  private static async getKey(): Promise<CryptoKey> {
    const keyMaterial = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(secretKey.padEnd(32, "0").substring(0, 32)),
      { name: "PBKDF2" },
      false,
      ["deriveKey"],
    )

    return crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt: new TextEncoder().encode("chat-encryption-salt"),
        iterations: 100000,
        hash: "SHA-256",
      },
      keyMaterial,
      { name: "AES-GCM", length: 256 },
      false,
      ["encrypt", "decrypt"],
    )
  }

  static async encrypt(data: any): Promise<EncryptedData> {
    try {
      const key = await this.getKey()
      const iv = crypto.getRandomValues(new Uint8Array(16))
      const encodedData = new TextEncoder().encode(JSON.stringify(data))

      const encrypted = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, encodedData)

      return {
        encrypted: Array.from(new Uint8Array(encrypted))
          .map((b) => b.toString(16).padStart(2, "0"))
          .join(""),
        iv: Array.from(iv)
          .map((b) => b.toString(16).padStart(2, "0"))
          .join(""),
        authTag: "", // GCM mode includes auth tag in encrypted data
      }
    } catch (error) {
      console.error("Client encryption error:", error)
      throw new Error("Failed to encrypt payload on client")
    }
  }

  static async decrypt(encryptedData: EncryptedData): Promise<any> {
    try {
      const key = await this.getKey()
      const iv = new Uint8Array(encryptedData.iv.match(/.{2}/g)!.map((byte) => Number.parseInt(byte, 16)))
      const encrypted = new Uint8Array(encryptedData.encrypted.match(/.{2}/g)!.map((byte) => Number.parseInt(byte, 16)))

      const decrypted = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, encrypted)

      const jsonString = new TextDecoder().decode(decrypted)
      return JSON.parse(jsonString)
    } catch (error) {
      console.error("Client decryption error:", error)
      throw new Error("Failed to decrypt payload on client")
    }
  }
}
