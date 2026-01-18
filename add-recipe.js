#!/usr/bin/env node

/**
 * Recipe Addition Script
 * Automatically adds a new recipe to the recipes folder and updates the index.html
 *
 * Usage:
 *   node add-recipe.js
 *   (Then follow the interactive prompts)
 *
 * Or use with recipe data JSON:
 *   node add-recipe.js recipe-data.json
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Helper function to escape HTML
function escapeHTML(str) {
    if (!str) return '';
    return str.replace(/[&<>"']/g, (match) => {
        const escapeMap = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        };
        return escapeMap[match];
    });
}

// Helper function to create filename from recipe name
function createFilename(recipeName) {
    return recipeName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '') + '.html';
}

// Generate recipe HTML
function generateRecipeHTML(data) {
    const name = escapeHTML(data.name);
    const description = escapeHTML(data.description);
    const prepTime = data.prepTime ? `PT${data.prepTime}M` : '';
    const cookTime = data.cookTime ? `PT${data.cookTime}M` : '';
    const servings = data.servings || '';

    const ingredients = data.ingredients
        .split('\n')
        .filter(i => i.trim())
        .map(i => escapeHTML(i.trim()));

    const instructions = data.instructions
        .split('\n')
        .filter(i => i.trim())
        .map(i => escapeHTML(i.trim()));

    let descHTML = description ? `<p class="description">${description}</p>\n\n` : '';

    let metaHTML = '';
    if (prepTime || cookTime || servings) {
        metaHTML = '<div class="recipe-meta">\n';
        if (prepTime) metaHTML += `    <div><strong>Prep:</strong> ${data.prepTime} min</div>\n`;
        if (cookTime) metaHTML += `    <div><strong>Cook:</strong> ${data.cookTime} min</div>\n`;
        if (servings) metaHTML += `    <div><strong>Servings:</strong> ${servings}</div>\n`;
        metaHTML += '</div>\n\n';
    }

    const ingredientsJSON = ingredients.map(i => `    "${i}"`).join(',\n');
    const instructionsJSON = instructions.map((inst, idx) =>
        `    {\n      "@type": "HowToStep",\n      "position": ${idx + 1},\n      "text": "${inst}"\n    }`
    ).join(',\n');

    const ingredientsHTML = ingredients.map(i => `                    <li>${i}</li>`).join('\n');
    const instructionsHTML = instructions.map(i => `                    <li>${i}</li>`).join('\n');

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${name}</title>
    <link rel="stylesheet" href="../style.css">
    <script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Recipe",
  "name": "${name}",${description ? `\n  "description": "${description}",` : ''}${prepTime ? `\n  "prepTime": "${prepTime}",` : ''}${cookTime ? `\n  "cookTime": "${cookTime}",` : ''}${servings ? `\n  "recipeYield": "${servings}",` : ''}
  "recipeIngredient": [
${ingredientsJSON}
  ],
  "recipeInstructions": [
${instructionsJSON}
  ]
}
    </script>
</head>
<body>
    <div class="container">
        <h1>${name}</h1>
        ${descHTML}${metaHTML}<div class="recipe-content">
            <div class="ingredients">
                <h2>Ingredients</h2>
                <ul>
${ingredientsHTML}
                </ul>
            </div>

            <div class="instructions">
                <h2>Instructions</h2>
                <ol>
${instructionsHTML}
                </ol>
            </div>
        </div>
    </div>
</body>
</html>
`;
}

// Update index.html recipes array
function updateIndexHTML(recipeName, filename) {
    const indexPath = path.join(__dirname, 'index.html');
    let indexContent = fs.readFileSync(indexPath, 'utf8');

    // Find the recipes array
    const recipesArrayMatch = indexContent.match(/const recipes = \[([\s\S]*?)\];/);
    if (!recipesArrayMatch) {
        console.error('Error: Could not find recipes array in index.html');
        return false;
    }

    const currentArray = recipesArrayMatch[1].trim();
    const newEntry = `{ name: "${recipeName}", file: "${filename}" }`;

    let newArray;
    if (currentArray === '') {
        newArray = `\n            ${newEntry}\n        `;
    } else {
        newArray = currentArray + `,\n            ${newEntry}`;
    }

    const newRecipesArray = `const recipes = [${newArray}];`;
    indexContent = indexContent.replace(/const recipes = \[[\s\S]*?\];/, newRecipesArray);

    fs.writeFileSync(indexPath, indexContent, 'utf8');
    return true;
}

// Interactive mode
async function interactiveMode() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    const question = (prompt) => new Promise((resolve) => rl.question(prompt, resolve));

    console.log('\n=== AnyList Recipe Adder ===\n');

    const data = {};
    data.name = await question('Recipe Name: ');
    data.description = await question('Description (optional): ');
    data.prepTime = await question('Prep Time (minutes, optional): ');
    data.cookTime = await question('Cook Time (minutes, optional): ');
    data.servings = await question('Servings (optional): ');

    console.log('\nEnter ingredients (one per line, press Enter twice when done):');
    let ingredients = [];
    while (true) {
        const line = await question('');
        if (line.trim() === '') break;
        ingredients.push(line);
    }
    data.ingredients = ingredients.join('\n');

    console.log('\nEnter instructions (one per line, press Enter twice when done):');
    let instructions = [];
    while (true) {
        const line = await question('');
        if (line.trim() === '') break;
        instructions.push(line);
    }
    data.instructions = instructions.join('\n');

    rl.close();

    return data;
}

// Main function
async function main() {
    let recipeData;

    // Check if JSON file provided
    if (process.argv[2]) {
        const jsonPath = path.resolve(process.argv[2]);
        if (!fs.existsSync(jsonPath)) {
            console.error(`Error: File not found: ${jsonPath}`);
            process.exit(1);
        }
        recipeData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    } else {
        // Interactive mode
        recipeData = await interactiveMode();
    }

    if (!recipeData.name || !recipeData.ingredients || !recipeData.instructions) {
        console.error('Error: Recipe must have at least a name, ingredients, and instructions');
        process.exit(1);
    }

    // Generate HTML
    const html = generateRecipeHTML(recipeData);
    const filename = createFilename(recipeData.name);
    const filepath = path.join(__dirname, 'recipes', filename);

    // Save recipe file
    fs.writeFileSync(filepath, html, 'utf8');
    console.log(`\n✓ Recipe saved to: recipes/${filename}`);

    // Update index.html
    if (updateIndexHTML(recipeData.name, filename)) {
        console.log(`✓ Updated index.html with new recipe`);
    }

    console.log('\nDone! You can now:');
    console.log('1. git add recipes/' + filename + ' index.html');
    console.log('2. git commit -m "Add recipe: ' + recipeData.name + '"');
    console.log('3. git push');
}

main().catch(console.error);
