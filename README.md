# THOR public research website

A responsive static showcase for **Tri-Hybrid Optimization and Reconfiguration for Extreme MIMO Systems**. It presents the research direction, three-layer architecture, project news, public release highlights, and planned research outputs. HTML, CSS, native SVG, and JavaScript require no build tool or runtime dependencies. System fonts keep the page self-contained.

## Preview

From the project root, run `python -m http.server 8000` and open `http://localhost:8000/docs/`. All asset paths are relative, so GitHub Pages project URLs are supported.

## Publish with GitHub Pages

1. Create or select the intended public GitHub repository. Publish **only `docs/`** from this workspace, after reviewing its contents. Budgets, proposals, presentations, transcripts, and videos elsewhere in this workspace are outside the website publication scope.
2. Keep this directory named `docs` in the repository root. In GitHub repository **Settings → Pages**, choose **Deploy from a branch**, the publication branch, and **/docs**. Save. `.nojekyll` serves these static files directly.
3. Open the Pages URL and check desktop and mobile layouts. Deployment can take a few minutes.

The site is a public research showcase. It includes no forms, accounts, submission backend, analytics, or tracking.

## Maintain content

Edit `site-config.js`. The `news`, `releases`, and `roadmap` arrays drive their respective sections. Text is inserted using DOM text content; links allow only HTTPS URLs or local section anchors.

News fields: `title`, `category`, `date` (ISO `YYYY-MM-DD`, or empty for an undated overview), `summary`, `href`, `linkLabel`.

Release fields: the same fields, plus optional `version`. Add an entry only after the artifact and release notes are public. Use the actual release URL as `href`. Keep `releases: []` until then.

Roadmap fields: `title`, `detail`. These entries are explicitly planned, without implied completion or dates. Review claims, links, dates, and permission to publish before adding content.

The research summary is grounded in `notes/tri_hybrid_literature_review.md` in the working project. The MITRE and UC San Diego attribution follows `Track1_2549147_MITRE_transcript.vtt`. These local source documents are not required for hosting and are not linked as public resources. External foundational reading links to arXiv `2501.16610`. The array graphic is conceptual, not a simulation or performance claim.

## Validate changes

- Desktop and mobile layouts, navigation, and contrast.
- Research tabs, including arrow keys, Home, and End.
- News and release tabs, search matches, and empty states.
- Keyboard traversal, reduced motion, and readable introductory content without JavaScript.
- No unpublished project material or invented releases, dates, or performance claims.

Development validation files, if present, are not runtime requirements.
