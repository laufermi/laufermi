import { getCollection } from 'astro:content';

// A single publication boundary for routes, listings, and RSS.
export async function publishedArticles() {
  return (await getCollection('articles', ({ data }) => !data.draft && data.date <= new Date()))
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf() || a.id.localeCompare(b.id));
}

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat('en', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }).format(date);
}
