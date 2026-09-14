# Maintainer guide

Development, authoring, and deployment notes for FM6MHZ. This guide is public because the repository is public.

## Local development

Use Node.js 24 (minimum 22.12) and npm.

```sh
npm ci
npm run dev
```

Open http://localhost:4321. Before publishing, run:

```sh
npm run check
npm run build
npm test
npm run preview
```

The tests inspect generated links and HTTPS metadata, compare retained downloads byte for byte, and build temporary articles to verify publication, draft exclusion, future-date exclusion, Markdown rendering, and RSS/sitemap inclusion. They remove their fixtures and rebuild the real site before exiting. Run tests in a clean checkout, not alongside another build.

## Write an article

Create `src/content/articles/your-article.md`. Its filename becomes `/articles/your-article/`; keep it stable after publication.

```yaml
---
title: "Your article title"
description: "A short summary for the article list and search engines."
date: 2026-09-14
tags: [Architecture]
draft: true
---
```

Write the body in Markdown below the front matter. The included `first-article.md` is an unpublished authoring example. Replace its content before publishing. Set `draft: false` only when ready. Drafts are excluded from routes, homepage, article index, RSS, and sitemap, including in development. A future date also excludes the article until a build on or after that date; there is no automatic scheduled rebuild. Dates are displayed in UTC. To preview an article locally, temporarily set a current/past date and `draft: false`, then restore the draft flag before committing if it should remain unpublished. Draft source is still visible in this public repository.

## Content and design

`src/data/resources.json` contains all 45 migrated links. `src/styles/global.css` defines the editorial typography, ivory background, olive accents, and responsive layouts. `src/layouts/Base.astro` owns shared navigation and metadata. The generated visual reference and implementation notes are in `docs/design/`.

The original README is retained at `docs/original-resources.md`. Existing root files remain in place; their public copies preserve download URLs. When updating a retained file, update both copies; migration tests detect drift. The old `/privacy.html` URL leads to `/privacy/`, and `/privacy.md` remains downloadable. The existing application privacy policy is preserved verbatim, including its unfinished contact and date fields; it is not presented as a new website policy. Internal Thoughtworks resources are marked as requiring access. External link availability has not been comprehensively audited.

## Deployment

The site is deployed through GitHub Actions. The following steps document the publishing configuration and recovery procedure.

1. Review and merge the Astro changes into `main` when ready to publish.
2. In repository **Settings → Pages → Build and deployment**, change Source to **GitHub Actions**. Keep custom domain `www.fm6mhz.com` and **Enforce HTTPS** enabled.
3. Run **Validate and deploy Astro** from Actions if the merge-triggered run occurred before the Pages setting changed.
4. Confirm the deployment succeeds, then check HTTPS homepage, `/articles/`, `/resources/`, `/privacy.html`, `/global.m3u`, and `/rss.xml`.

The workflow validates pull requests without publishing. Pushes to `main` and manual runs on `main` deploy only after checks and tests pass. It uploads `dist/`; no server adapter is needed. `site` is the HTTPS custom domain and there is no repository-name base path. GitHub Actions deployments use the custom domain stored in Pages settings; the retained CNAME is not relied on for Actions routing. Changing publication mode can temporarily affect the existing site, so perform the settings change together with the first deployment.

To roll back, revert the migration commit and restore Pages publishing from `main` at `/`, preserving the custom domain and HTTPS settings.
