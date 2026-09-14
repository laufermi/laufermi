# Local verification

The site is implemented and locally verified; no remote commit, deployment, or Pages publishing-mode change has been made. The concept is a working design reference, not explicit user design approval.

`npm run check` completed with zero errors, warnings, or hints. `npm run build` and `npm test` passed. The tests verify generated internal links/anchors, HTTPS canonical metadata, all 45 resources, retained downloads, the legacy privacy URL, rendered Markdown, and publication exclusion across routes, listings, RSS, and sitemap. Temporary published, draft, and future-dated fixtures were removed and the final site rebuilt.

In-app Browser verified homepage navigation, resources, and the article empty state. Its screenshot export showed inconsistent scaling/cropping despite correct DOM dimensions, so Playwright CLI Chromium supplied the visual evidence. Desktop comparison used a 1440×1100 viewport, approximating the generated reference's 1435×1096 native dimensions. Responsive checks covered Home, Articles, and Resources at 320, 390, 768, and 1440px without horizontal overflow. A temporary article was also checked at desktop and 390px; the table of contents and return link worked. Resource search was checked for two Kubernetes matches, zero matches, and reset to all 45 entries.

## Visual comparison

The reference and final screenshots were inspected with `view_image`. The implementation preserves the reference's hierarchy and visual system; it is not claimed to be pixel-identical to a generated image.

| Dimension | Reference and render comparison | Resolution |
| --- | --- | --- |
| Copy | Motto, description, navigation, actions, empty state, and three resource categories match | No added or missing above-the-fold copy |
| Layout | Two-column hero, narrow section-label rail, open resource rows, compact footer | Preserved; mobile stacks columns |
| Typography | Serif display headings and sans body/navigation | Changed Georgia to Times to better match the reference; system fonts intentionally avoid a remote font request |
| Palette | Ivory background, dark ink, olive actions, muted rules | CSS uses the specified design tokens; generated paper texture is intentionally omitted |
| Spacing | Broad hero whitespace and horizontal section rules | Reduced hero bottom padding after comparison |
| Controls | Underlined text links, thin directional arrows, visible navigation | SVG arrows and keyboard focus styling implemented |
| Responsive reading | Long code widened the mobile article | Applied a shrinkable reading column; code scrolls inside its block; rechecked successfully |

No unresolved functional or clipping issue remains in the checked surfaces. Resource search, article metadata/contents navigation, privacy rendering, and 404 are intentional functional extensions of the homepage concept. External resources were retained rather than exhaustively availability-tested. The original privacy policy still has its pre-existing placeholder fields. GitHub Actions execution and live acceptance remain unverified until publication.
