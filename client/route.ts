import { type NextRequest, NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { existsSync } from "fs"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Create assets directory if it doesn't exist
    const assetsDir = join(process.cwd(), "assets")
    if (!existsSync(assetsDir)) {
      await mkdir(assetsDir, { recursive: true })
    }

    // Generate a unique filename
    const uniqueFilename = `${Date.now()}-${file.name}`
    const filePath = join(assetsDir, uniqueFilename)

    // Write the file to the assets directory
    await writeFile(filePath, buffer)

    // Return the file path relative to the assets directory
    return NextResponse.json({
      message: "File uploaded successfully",
      filePath: `/assets/${uniqueFilename}`,
    })
  } catch (error) {
    console.error("Error uploading file:", error)
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 })
  }
}

