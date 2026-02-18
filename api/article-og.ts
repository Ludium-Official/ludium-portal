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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { id } = req.query;

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
      res.setHeader('Location', `/community/articles/${id}`);
      res.status(302).end();
      return;
    }

    const title = article.title || 'Ludium Portal';
    const description = stripMarkdown(article.description) || 'Ludium Portal - Community Article';
    const image = article.coverImage || extractFirstImage(article.description) || 'https://ludium.world/logo.svg';
    const url = `https://ludium.world/community/articles/${id}`;

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title} | Ludium Portal</title>

  <meta name="description" content="${description}" />

  <meta property="og:type" content="article" />
  <meta property="og:url" content="${url}" />
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${description}" />
  <meta property="og:image" content="${image}" />
  <meta property="og:site_name" content="Ludium Portal" />

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:url" content="${url}" />
  <meta name="twitter:title" content="${title}" />
  <meta name="twitter:description" content="${description}" />
  <meta name="twitter:image" content="${image}" />

  <meta http-equiv="refresh" content="0;url=${url}" />
</head>
<body>
  <p>Redirecting to <a href="${url}">${title}</a>...</p>
</body>
</html>`;

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
    res.status(200).send(html);
  } catch (error) {
    console.error('Error fetching article:', error);
    res.setHeader('Location', `/community/articles/${id}`);
    res.status(302).end();
  }
}
