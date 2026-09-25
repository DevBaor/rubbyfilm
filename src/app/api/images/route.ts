import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const ALLOWED_HOSTS = new Set([
  "phimimg.com",
  "img.phimapi.com",
  "image.tmdb.org",
  "images.unsplash.com",
]);

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const p = searchParams.get("p");
  const rawUrl = searchParams.get("url");

  if (!p && !rawUrl) {
    return new NextResponse("Missing image parameter", { status: 400 });
  }

  let targetUrl = "";

  if (p) {
    const cleanPath = p.startsWith("/") ? p : `/${p}`;
    targetUrl = `https://phimimg.com${cleanPath}`;
  } else if (rawUrl) {
    targetUrl = rawUrl;
    if (targetUrl.startsWith("/")) {
      targetUrl = `https://phimimg.com${targetUrl}`;
    }
  }

  try {
    const parsed = new URL(targetUrl);
    
    // Safety check: only allow images from known movie CDNs
    if (!ALLOWED_HOSTS.has(parsed.hostname) && !parsed.hostname.endsWith(".phimimg.com") && !parsed.hostname.endsWith(".tmdb.org")) {
      return new NextResponse("Unauthorized image host", { status: 403 });
    }

    const res = await fetch(targetUrl, {
      headers: {
        "User-Agent": "RubbyFilm-CDN/1.0",
        Accept: "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
      },
      next: { revalidate: 86400 * 7 }, // Cache for 7 days
    });

    if (!res.ok) {
      return new NextResponse("Failed to fetch image", { status: res.status });
    }

    const contentType = res.headers.get("content-type") || "image/jpeg";
    const buffer = await res.arrayBuffer();

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=604800, s-maxage=2592000, stale-while-revalidate=86400",
        "X-Served-By": "RubbyFilm-Media-Gateway",
      },
    });
  } catch (error) {
    console.error("Image proxy error:", error);
    return new NextResponse("Error fetching image", { status: 500 });
  }
}
