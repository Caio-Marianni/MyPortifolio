import type { VideoCoverData } from "@/types/video-cover";

export async function getStaticVideoCovers(): Promise<VideoCoverData> {
  const fs = await import("fs/promises");
  const path = await import("path");

  const filePath = path.join(process.cwd(), "public/data/video-covers.json");
  const fileContents = await fs.readFile(filePath, "utf8");

  return JSON.parse(fileContents);
}

export async function getVideoCovers(): Promise<VideoCoverData> {
  const response = await fetch("/data/video-covers.json");

  if (!response.ok) {
    throw new Error("Failed to load video covers");
  }

  return response.json();
}
