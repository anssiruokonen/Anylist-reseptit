import { put } from '@vercel/blob';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { slug, html } = body;

    // Validate input
    if (!slug || !html) {
      return NextResponse.json(
        { error: 'Missing required fields: slug and html' },
        { status: 400 }
      );
    }

    // Validate slug format (alphanumeric and hyphens only)
    if (!/^[a-z0-9-]+$/.test(slug)) {
      return NextResponse.json(
        { error: 'Invalid slug format. Use only lowercase letters, numbers, and hyphens.' },
        { status: 400 }
      );
    }

    // Upload HTML to Vercel Blob
    const blob = await put(`recipes/${slug}.html`, html, {
      access: 'public',
      contentType: 'text/html',
    });

    // Get the base URL for our API
    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : request.nextUrl.origin;

    // Return the API URL (not the blob URL)
    const apiUrl = `${baseUrl}/api/recipes/${slug}`;

    return NextResponse.json({
      url: apiUrl,
      blobUrl: blob.url,
      slug,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload recipe' },
      { status: 500 }
    );
  }
}
