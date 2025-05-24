import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString("base64");

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
    });

    if (!mathpixResponse.ok) {
      const error = await mathpixResponse.text();
      console.error("Mathpix API error:", error);
      return NextResponse.json(
        { error: "Failed to process math image" },
        { status: mathpixResponse.status }
      );
    }

    const data = await mathpixResponse.json();

    // Extract the LaTeX or text from the response
    const latex = data.latex_styled || data.text || "";

    return NextResponse.json({
      latex,
      text: data.text,
      confidence: data.confidence,
    });
  } catch (error) {
    console.error("Error processing math image:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
