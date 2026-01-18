# AnyList Recipe Converter

A simple static site for converting recipes to AnyList-compatible format using schema.org/Recipe JSON-LD markup.

## What This Is For

AnyList (grocery/recipe app) can import recipes from any webpage that has schema.org/Recipe structured data. Many recipe sites don't have this markup, so this tool lets you paste a recipe and generate a properly formatted page that AnyList can import.

## Project Structure

```
anylist-reseptit/
├── index.html          # Main converter UI with recipe list
├── add-recipe.js       # CLI tool for adding recipes automatically
├── package.json        # Project configuration
├── recipes/
│   └── lyonin-kana.html   # Sample recipe for testing
├── style.css           # Shared styles
├── .nojekyll           # Disable Jekyll processing for GitHub Pages
└── README.md
```

## How to Use

### Method 1: Automated Recipe Addition (Recommended)

Use the command-line tool to automatically add recipes to your collection:

```bash
node add-recipe.js
```

The script will prompt you for recipe details and automatically:
- Generate the recipe HTML file
- Save it to the `recipes/` folder
- Update `index.html` to include the new recipe in the list

You can also provide recipe data as a JSON file:

```bash
node add-recipe.js recipe-data.json
```

Example JSON format:
```json
{
  "name": "Chocolate Chip Cookies",
  "description": "Classic homemade cookies",
  "prepTime": "15",
  "cookTime": "12",
  "servings": "24",
  "ingredients": "2 cups flour\n1 cup butter\n1 cup sugar",
  "instructions": "Mix ingredients\nBake at 350°F for 12 minutes"
}
```

After adding a recipe, commit and push the changes:
```bash
git add recipes/ index.html
git commit -m "Add recipe: [Recipe Name]"
git push
```

### Method 2: Using the Web Interface

1. Open `index.html` in your browser (or visit the GitHub Pages URL)
2. Fill in the recipe details in the form
3. Click "Generate Recipe HTML"
4. Download the generated HTML file
5. Manually save it to `recipes/` and update the recipes array in `index.html`

### Viewing Saved Recipes

- Visit the main page to see all saved recipes
- Click on any recipe to view it
- Open recipe pages in your browser to import them to AnyList

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
