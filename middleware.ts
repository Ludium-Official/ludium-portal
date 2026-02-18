export const config = {
  matcher: '/community/articles/:path*',
};

export default function middleware(request: Request) {
  const userAgent = request.headers.get('user-agent') || '';

  const isCrawler =
    /twitterbot|facebookexternalhit|linkedinbot|slackbot|telegrambot|whatsapp|discordbot|googlebot|bingbot/i.test(
      userAgent,
    );

  if (isCrawler) {
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop();
    return Response.redirect(new URL(`/api/article-og?id=${id}`, url.origin), 307);
  }

  return;
}
