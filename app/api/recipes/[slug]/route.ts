import { head } from '@vercel/blob';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    // Validate slug
    if (!slug || !/^[a-z0-9-]+$/.test(slug)) {
      return new NextResponse('Invalid recipe slug', { status: 400 });
    }

    const blobUrl = `recipes/${slug}.html`;

    // Check if the blob exists and get its metadata
    let blobData;
    try {
      blobData = await head(blobUrl);
    } catch (error) {
      return new NextResponse('Recipe not found', { status: 404 });
    }

    // Fetch the HTML content from the blob URL
    const response = await fetch(blobData.url);
    if (!response.ok) {
      return new NextResponse('Failed to fetch recipe', { status: 500 });
    }

    const html = await response.text();

    // Return the HTML with proper content type
    return new NextResponse(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    });
  } catch (error) {
    console.error('Recipe fetch error:', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}
