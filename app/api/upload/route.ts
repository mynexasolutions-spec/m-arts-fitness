import { NextResponse } from "next/server";
import { getImageKitServer } from "@/lib/imagekit";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const folder = (formData.get("folder") as string) || "/products";

    // Gather all files from form-data (supports single "file" or multiple "files" / "file")
    const rawFiles = formData.getAll("files").concat(formData.getAll("file"));
    const files = rawFiles.filter((f): f is File => f instanceof File && f.size > 0);

    if (files.length === 0) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const imagekit = getImageKitServer();

    // Upload files concurrently
    const uploadPromises = files.map(async (file) => {
      const buffer = Buffer.from(await file.arrayBuffer());
      const uploadResponse = await imagekit.upload({
        file: buffer,
        fileName: file.name,
        folder,
        useUniqueFileName: true,
      });

      return {
        url: uploadResponse.url,
        fileId: uploadResponse.fileId,
        name: uploadResponse.name,
        thumbnailUrl: uploadResponse.thumbnailUrl || uploadResponse.url,
      };
    });

    const results = await Promise.all(uploadPromises);

    return NextResponse.json({
      // Backward compatibility for single file callers
      ...(results[0] || {}),
      items: results,
      urls: results.map((r) => r.url),
      count: results.length,
    });
  } catch (error: any) {
    console.error("Upload handler error:", error);
    return NextResponse.json(
      { error: error?.message || "Upload failed" },
      { status: 500 }
    );
  }
}
