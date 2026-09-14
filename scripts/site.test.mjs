import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir, stat, writeFile, rm } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { load } from 'cheerio';
import path from 'node:path';

const root = process.cwd();
const read = file => readFile(path.join(root, file), 'utf8');
const build = () => execFileSync(process.execPath, ['node_modules/astro/bin/astro.mjs', 'build'], { stdio: 'pipe' });
async function files(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  return (await Promise.all(entries.map(entry => entry.isDirectory() ? files(path.join(dir, entry.name)) : path.join(dir, entry.name)))).flat();
}

test('built routes, HTTPS metadata, local links, and preserved downloads', async () => {
  for (const name of ['global.m3u', 'icon-r&b.jpg', 'Written-By-Human-Not-By-AI-Badge-white@2x.png', 'newman.demo.collections.json', 'post-queue.adoc', 'privacy.md', 'CNAME']) {
    assert.deepEqual(await readFile(`dist/${name}`), await readFile(name), `${name} preserved byte for byte`);
  }
  const pages = (await files('dist')).filter(file => file.endsWith('.html'));
  for (const file of pages) {
    const $ = load(await read(file));
    assert.match($('link[rel=canonical]').attr('href'), /^https:\/\/www\.fm6mhz\.com\//);
    for (const el of $('a[href^="/"], link[href^="/"], script[src^="/"]')) {
      const href = $(el).attr('href') || $(el).attr('src');
      const url = new URL(href, 'https://www.fm6mhz.com');
      let target = path.join('dist', decodeURIComponent(url.pathname));
      if (url.pathname.endsWith('/')) target = path.join(target, 'index.html');
      assert.ok((await stat(target)).isFile(), `${file} -> ${href}`);
      if (url.hash && target.endsWith('.html')) {
        const doc = load(await read(target));
        assert.ok(doc('[id]').toArray().some(node => doc(node).attr('id') === decodeURIComponent(url.hash.slice(1))), `${href} anchor exists`);
      }
    }
  }
  const resources = JSON.parse(await read('src/data/resources.json')).flatMap(group => group.links);
  const html = load(await read('dist/resources/index.html'));
  assert.equal(resources.length, 45);
  for (const resource of resources) assert.ok(html('a').toArray().some(el => html(el).attr('href') === resource.url));
  assert.match(await read('dist/privacy.html'), /url=\/privacy\//);
});

test('publication boundary renders published Markdown but excludes drafts and future articles from all outputs', async () => {
  const fixtures = [
    ['qa-published', '2000-01-01', 'false'],
    ['qa-draft', '2000-01-01', 'true'],
    ['qa-future', '2999-01-01', 'false'],
  ];
  try {
    for (const [id, date, draft] of fixtures) {
      await writeFile(`src/content/articles/${id}.md`, `---\ntitle: ${id}\ndescription: Publication boundary fixture\ndate: ${date}\ndraft: ${draft}\ntags: [Testing]\n---\n\n## Evidence\n\nA **rendered** paragraph.\n`);
    }
    build();
    const article = await read('dist/articles/qa-published/index.html');
    assert.match(article, /<strong>rendered<\/strong>/);
    assert.match(article, /href="#evidence"/);
    for (const file of ['dist/index.html', 'dist/articles/index.html', 'dist/rss.xml', 'dist/sitemap-0.xml']) {
      const content = await read(file);
      assert.ok(content.includes('qa-published'), `${file} contains published article`);
      assert.ok(!content.includes('qa-draft') && !content.includes('qa-future') && !content.includes('first-article'), `${file} excludes unpublished articles`);
    }
    await assert.rejects(stat('dist/articles/qa-draft/index.html'));
    await assert.rejects(stat('dist/articles/qa-future/index.html'));
  } finally {
    for (const [id] of fixtures) await rm(`src/content/articles/${id}.md`, { force: true });
    build();
  }
});
