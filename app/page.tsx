export default function Home() {
  return (
    <main style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h1>AnyList Recipes</h1>
      <p>
        Recipe HTML storage using Vercel Blob. This service provides a simple API
        to store and retrieve recipe HTML files with schema.org/Recipe markup.
      </p>

      <h2>API Endpoints</h2>

      <section style={{ marginBottom: '2rem' }}>
        <h3>POST /api/upload</h3>
        <p>Upload a recipe HTML file to Blob storage.</p>
        <pre style={{
          background: '#f5f5f5',
          padding: '1rem',
          borderRadius: '4px',
          overflow: 'auto'
        }}>
{`{
  "slug": "lyonin-kana",
  "html": "<!DOCTYPE html>..."
}`}
        </pre>
        <p>Returns:</p>
        <pre style={{
          background: '#f5f5f5',
          padding: '1rem',
          borderRadius: '4px',
          overflow: 'auto'
        }}>
{`{
  "url": "https://anylist-recipes.vercel.app/api/recipes/lyonin-kana",
  "blobUrl": "https://...",
  "slug": "lyonin-kana"
}`}
        </pre>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h3>GET /api/recipes/[slug]</h3>
        <p>Retrieve a recipe HTML file by its slug.</p>
        <p>Example: <code>/api/recipes/lyonin-kana</code></p>
        <p>Returns the HTML content with <code>Content-Type: text/html</code></p>
      </section>

      <h2>Setup</h2>
      <ol>
        <li>Create a Vercel Blob store in your Vercel dashboard</li>
        <li>Set the <code>BLOB_READ_WRITE_TOKEN</code> environment variable</li>
        <li>Deploy to Vercel or run locally with <code>npm run dev</code></li>
      </ol>

      <h2>Usage with AnyList</h2>
      <p>
        Upload your recipe HTML (with schema.org/Recipe JSON-LD markup) using the
        <code>/api/upload</code> endpoint. Use the returned URL to import the recipe
        into AnyList.
      </p>
    </main>
  );
}
