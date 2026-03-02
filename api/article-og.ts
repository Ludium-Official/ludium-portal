import type { VercelRequest, VercelResponse } from '@vercel/node';

const GRAPHQL_ENDPOINT = `${process.env.VITE_SERVER_URL}/graphql`;

const ARTICLE_QUERY = `
  query article($id: ID!) {
    article(id: $id) {
      id
      title
      description
      coverImage
      author {
        nickname
      }
    }
  }
`;

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function extractFirstImage(description: string | null | undefined): string | null {
  if (!description) return null;
  const imgMatch = description.match(/!\[.*?\]\((.*?)\)/);
  return imgMatch ? imgMatch[1] : null;
}

function stripMarkdown(text: string | null | undefined): string {
  if (!text) return '';
  return text
    .replace(/!\[.*?\]\(.*?\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[#*_~`>]/g, '')
    .replace(/\n+/g, ' ')
    .trim()
    .slice(0, 200);
}

function generateOgHtml(
  title: string,
  description: string,
  image: string,
  url: string,
): string {
  const safeTitle = escapeHtml(title);
  const safeDescription = escapeHtml(description);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${safeTitle} | Ludium Portal</title>

  <meta name="description" content="${safeDescription}" />

  <meta property="og:type" content="article" />
  <meta property="og:url" content="${url}" />
  <meta property="og:title" content="${safeTitle}" />
  <meta property="og:description" content="${safeDescription}" />
  <meta property="og:image" content="${image}" />
  <meta property="og:site_name" content="Ludium Portal" />

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:url" content="${url}" />
  <meta name="twitter:title" content="${safeTitle}" />
  <meta name="twitter:description" content="${safeDescription}" />
  <meta name="twitter:image" content="${image}" />
</head>
<body>
  <p>Redirecting to <a href="${url}">${safeTitle}</a>...</p>
  <script>window.location.href = "${url}";</script>
</body>
</html>`;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { id } = req.query;
  const url = `https://ludium.world/community/articles/${id}`;
  const defaultImage = 'https://ludium.world/logo.svg';

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');

  try {
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: ARTICLE_QUERY,
        variables: { id },
      }),
    });

    const { data } = await response.json();
    const article = data?.article;

    if (!article) {
      const html = generateOgHtml('Ludium Portal', 'Community Article', defaultImage, url);
      res.status(200).send(html);
      return;
    }

    const title = article.title || 'Ludium Portal';
    const description = stripMarkdown(article.description) || 'Ludium Portal - Community Article';
    const image = article.coverImage || extractFirstImage(article.description) || defaultImage;

    const html = generateOgHtml(title, description, image, url);
    res.status(200).send(html);
  } catch (error) {
    console.error('Error fetching article:', error);
    const html = generateOgHtml('Ludium Portal', 'Community Article', defaultImage, url);
    res.status(200).send(html);
  }
}
