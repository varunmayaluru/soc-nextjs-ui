import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    // Check if environment variables are set
    if (!process.env.MATHPIX_APP_ID || !process.env.MATHPIX_APP_KEY) {
      console.error("Mathpix environment variables not set")
      return NextResponse.json(
        { error: "Mathpix service not configured. Please check environment variables." },
        { status: 500 },
      )
    }

    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "File must be an image" }, { status: 400 })
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "File size too large (max 10MB)" }, { status: 400 })
    }

    console.log("Processing file:", file.name, "Size:", file.size, "Type:", file.type)

    // Convert file to base64
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = buffer.toString("base64")

    console.log("Sending request to Mathpix API...")

    // Prepare the request to Mathpix API
    const mathpixResponse = await fetch("https://api.mathpix.com/v3/text", {
      method: "POST",
      headers: {
        app_id: process.env.MATHPIX_APP_ID!,
        app_key: process.env.MATHPIX_APP_KEY!,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        src: `data:${file.type};base64,${base64}`,
        formats: ["text", "latex_styled"],
        data_options: {
          include_asciimath: true,
          include_latex: true,
        },
      }),
    })

    console.log("Mathpix response status:", mathpixResponse.status)

    if (!mathpixResponse.ok) {
      const error = await mathpixResponse.text()
      console.error("Mathpix API error:", error)

      // Handle specific error cases
      if (mathpixResponse.status === 401) {
        return NextResponse.json({ error: "Invalid Mathpix credentials" }, { status: 401 })
      } else if (mathpixResponse.status === 429) {
        return NextResponse.json({ error: "Mathpix API rate limit exceeded" }, { status: 429 })
      }

      return NextResponse.json({ error: "Failed to process math image" }, { status: mathpixResponse.status })
    }

    const data = await mathpixResponse.json()
    console.log("Mathpix response data:", data)

    // Extract the LaTeX or text from the response
    const latex = data.latex_styled || data.text || ""

    if (!latex) {
      return NextResponse.json({ error: "No mathematical content detected in image" }, { status: 400 })
    }

    return NextResponse.json({
      latex,
      text: data.text,
      confidence: data.confidence,
    })
  } catch (error) {
    console.error("Error processing math image:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
