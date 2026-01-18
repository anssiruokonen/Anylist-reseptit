# AnyList Recipes - Vercel Blob Storage

A Next.js application that uses Vercel Blob storage to host recipe HTML files with schema.org/Recipe JSON-LD markup. This provides a simple API to store and retrieve recipe HTML files that can be imported into AnyList.

## Features

- **Upload API**: Store recipe HTML files to Vercel Blob storage
- **Retrieve API**: Serve recipe HTML files with proper content-type headers
- **Public URLs**: Get shareable URLs for importing recipes into AnyList
- **TypeScript**: Full type safety throughout the application

## Tech Stack

- Next.js 16 (App Router)
- TypeScript
- Vercel Blob Storage (@vercel/blob)
- React 19

## Prerequisites

- Node.js 18+
- A Vercel account (free tier works)
- npm or yarn

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Create a Vercel Blob Store

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Navigate to **Storage** → **Blob**
3. Click **Create Blob Store**
4. Name it (e.g., "anylist-recipes-storage")
5. Copy the **Read-Write Token** (starts with `vercel_blob_rw_`)

### 3. Configure Environment Variables

Create a `.env.local` file in the project root:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your token:

```env
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_xxxxxxxxxxxxx
```

### 4. Run Locally

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the landing page.

### 5. Deploy to Vercel

```bash
# Install Vercel CLI if you haven't
npm i -g vercel

# Deploy
vercel
```

Or push to GitHub and connect the repository in the Vercel dashboard.

**Important**: Set the `BLOB_READ_WRITE_TOKEN` environment variable in your Vercel project settings.

## API Documentation

### POST /api/upload

Upload a recipe HTML file to Blob storage.

**Request:**

```json
{
  "slug": "lyonin-kana",
  "html": "<!DOCTYPE html><html>...</html>"
}
```

**Response:**

```json
{
  "url": "https://anylist-recipes.vercel.app/api/recipes/lyonin-kana",
  "blobUrl": "https://xxxxxxxxxxxxx.public.blob.vercel-storage.com/recipes/lyonin-kana.html",
  "slug": "lyonin-kana"
}
```

**Example:**

```bash
curl -X POST https://anylist-recipes.vercel.app/api/upload \
  -H "Content-Type: application/json" \
  -d '{
    "slug": "lyonin-kana",
    "html": "<!DOCTYPE html><html><head><title>Recipe</title></head><body><h1>Recipe</h1></body></html>"
  }'
```

### GET /api/recipes/[slug]

Retrieve a recipe HTML file by its slug.

**Example:**

```bash
curl https://anylist-recipes.vercel.app/api/recipes/lyonin-kana
```

Returns the HTML content with `Content-Type: text/html; charset=utf-8`.

## Recipe HTML Format

Your recipe HTML should include schema.org/Recipe JSON-LD markup for AnyList compatibility:

```html
<!DOCTYPE html>
<html>
<head>
  <title>Recipe Name</title>
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Recipe",
    "name": "Recipe Name",
    "description": "Recipe description",
    "recipeIngredient": [
      "2 cups flour",
      "1 cup sugar"
    ],
    "recipeInstructions": [
      {
        "@type": "HowToStep",
        "text": "Mix ingredients"
      },
      {
        "@type": "HowToStep",
        "text": "Bake at 350°F"
      }
    ],
    "prepTime": "PT15M",
    "cookTime": "PT30M",
    "recipeYield": "4 servings"
  }
  </script>
</head>
<body>
  <h1>Recipe Name</h1>
  <!-- Your recipe content here -->
</body>
</html>
```

## Usage with AnyList

1. Upload your recipe HTML using the `/api/upload` endpoint
2. Copy the returned `url` (e.g., `https://anylist-recipes.vercel.app/api/recipes/lyonin-kana`)
3. In AnyList, import the recipe using this URL
4. AnyList will parse the schema.org/Recipe JSON-LD markup

## Project Structure

```
anylist-recipes/
├── app/
│   ├── api/
│   │   ├── upload/
│   │   │   └── route.ts          # Upload recipe endpoint
│   │   └── recipes/
│   │       └── [slug]/
│   │           └── route.ts      # Retrieve recipe endpoint
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Landing page
├── .env.example                  # Environment variable template
├── .env.local.example            # Local env template
├── .gitignore
├── next.config.ts
├── package.json
├── tsconfig.json
└── README.md
```

## Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

## Security Notes

- The `BLOB_READ_WRITE_TOKEN` should be kept secret
- Slugs are validated to only allow lowercase letters, numbers, and hyphens
- All uploaded HTML is stored as-is (no sanitization) - ensure you trust the source
- Recipe URLs are publicly accessible by design

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob storage read-write token | Yes |

## Troubleshooting

### "Missing BLOB_READ_WRITE_TOKEN" error

Make sure you've:
1. Created a Vercel Blob store
2. Copied the read-write token
3. Added it to `.env.local` (local) or Vercel project settings (production)

### Recipe not found (404)

- Check that the slug matches exactly (case-sensitive)
- Verify the recipe was uploaded successfully
- Check the Vercel Blob dashboard to see stored files

### Upload fails

- Ensure the `BLOB_READ_WRITE_TOKEN` is valid
- Check that your HTML is a valid string (properly escaped JSON)
- Verify the slug format (only lowercase letters, numbers, hyphens)

## License

MIT

## Contributing

Feel free to open issues or submit pull requests!
