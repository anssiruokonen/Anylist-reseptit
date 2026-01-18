# AnyList Recipe Converter

A simple static site for converting recipes to AnyList-compatible format using schema.org/Recipe JSON-LD markup.

## What This Is For

AnyList (grocery/recipe app) can import recipes from any webpage that has schema.org/Recipe structured data. Many recipe sites don't have this markup, so this tool lets you paste a recipe and generate a properly formatted page that AnyList can import.

## Project Structure

```
anylist-reseptit/
├── index.html          # Main converter UI
├── recipes/
│   └── lyonin-kana.html   # Sample recipe for testing
├── style.css           # Shared styles
└── README.md
```

## How to Use

### Converting a Recipe

1. Open `index.html` in your browser
2. Fill in the recipe details:
   - Recipe name (required)
   - Description (optional)
   - Prep time, cook time, servings (optional)
   - Ingredients (required, one per line)
   - Instructions (required, one step per line)
3. Click "Generate Recipe HTML"
4. Copy the generated HTML or click "Download HTML"
5. Save the HTML file and open it in a browser
6. Use AnyList's import feature to import the recipe from that page

### Testing with Sample Recipe

Open `recipes/lyonin-kana.html` in your browser to see an example of a properly formatted recipe page with JSON-LD markup. You can use this to test AnyList's import functionality.

## Technical Details

The converter generates HTML pages with embedded JSON-LD structured data following the [schema.org/Recipe](https://schema.org/Recipe) specification. This includes:

- Recipe name and description
- Preparation and cooking times (in ISO 8601 duration format: PT20M = 20 minutes)
- Yield/servings
- Ingredients list
- Step-by-step instructions (using HowToStep format)

The JSON-LD is embedded in a `<script type="application/ld+json">` tag, which is what AnyList reads to import the recipe.

## No Build Process Required

This is a simple static site using vanilla HTML, CSS, and JavaScript. No frameworks, no build tools, no dependencies. Just open `index.html` in a browser and it works.

## Deploying

You can deploy this to any static hosting service:

- GitHub Pages
- Netlify
- Vercel
- Any web server

Just upload the files and you're done.
