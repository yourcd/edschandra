/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-article. Base: cards.
 * Source: https://wknd-trendsetters.site/about-us
 * Generated: 2026-09-01
 *
 * Block library convention (cards): 2-column table. First row = block name.
 * Each subsequent row is one card: [image cell, text-content cell].
 * The text cell may hold heading, description and a CTA link.
 * Source: each card is <a class="article-card card-link"> wrapping an image
 * (.article-card-image img) and a body (.article-card-body: meta + heading).
 */
export default function parse(element, { document }) {
  const cells = [];

  const cards = element.querySelectorAll(':scope > a.article-card, :scope > .article-card, :scope > a');

  cards.forEach((card) => {
    // Image cell.
    const img = card.querySelector('.article-card-image img, img');

    // Text content cell: meta and heading. The whole card is a link, so wrap the
    // heading text in an anchor to preserve the href without duplicating text.
    const contentCell = [];
    const meta = card.querySelector('.article-card-meta');
    if (meta) contentCell.push(meta);
    const heading = card.querySelector('h1, h2, h3, h4, h5, h6, [class*="heading"]');
    const href = card.getAttribute('href');
    if (heading) {
      if (href) {
        const link = document.createElement('a');
        link.href = href;
        link.textContent = heading.textContent.trim();
        heading.textContent = '';
        heading.appendChild(link);
      }
      contentCell.push(heading);
    } else if (href) {
      const link = document.createElement('a');
      link.href = href;
      link.textContent = 'Read more';
      contentCell.push(link);
    }

    if (img || contentCell.length) {
      cells.push([img || '', contentCell.length ? contentCell : '']);
    }
  });

  // Empty-block guard.
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-article', cells });
  element.replaceWith(block);
}
