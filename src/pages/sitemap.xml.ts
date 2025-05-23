import fs from 'fs';
import path from 'path';

export async function get() {
  const blogDir = path.resolve('./content/blog');
  const files = fs.readdirSync(blogDir);

  const urls = files.map(file => {
    const slug = file.replace('.md', '');
    const content = fs.readFileSync(path.join(blogDir, file), 'utf-8');
    const match = content.match(/pubDate:\s*["']?([\d-]+)["']?/);
    const pubDate = match ? match[1] : '2025-01-01';

    return `
  <url>
    <loc>https://www.aitoolsfordevs.in/blog/${slug}</loc>
    <lastmod>${pubDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`;
  });

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
