import { type NextRequest, NextResponse } from "next/server"
import { decryptPayload, type EncryptedData } from "@/lib/encryption"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Check if the request contains encrypted data
    if (!body.encrypted || !body.payload) {
      return NextResponse.json({ error: "Invalid encrypted payload format" }, { status: 400 })
    }

    // Decrypt the payload
    const decryptedData = decryptPayload(body.payload as EncryptedData)

    return NextResponse.json({
      success: true,
      data: decryptedData,
    })
  } catch (error) {
    console.error("Decryption error:", error)
    return NextResponse.json({ error: "Failed to decrypt payload" }, { status: 400 })
  }
}
