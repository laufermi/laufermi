import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { publishedArticles } from '../data/articles';

export async function GET(context: APIContext) {
  const articles = await publishedArticles();
  return rss({
    title: 'FM6MHZ — Articles',
    description: 'Articles on software architecture and engineering.',
    site: context.site!,
    items: articles.map(({ id, data }) => ({
      title: data.title, description: data.description, pubDate: data.date,
      link: `/articles/${id}/`, categories: data.tags,
    })),
  });
}
