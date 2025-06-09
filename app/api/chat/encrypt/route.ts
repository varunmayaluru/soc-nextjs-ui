import { type NextRequest, NextResponse } from "next/server"
import { encryptPayload } from "@/lib/encryption"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Encrypt the payload
    const encryptedData = encryptPayload(body)

    return NextResponse.json({
      success: true,
      encrypted: true,
      payload: encryptedData,
    })
  } catch (error) {
    console.error("Encryption error:", error)
    return NextResponse.json({ error: "Failed to encrypt payload" }, { status: 500 })
  }
}
