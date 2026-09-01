/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-gallery. Base: cards.
 * Source: https://wknd-trendsetters.site/about-us
 * Generated: 2026-09-01
 *
 * Block library convention (cards): 2-column table. First row = block name.
 * Each subsequent row is one card: [image cell, text-content cell].
 * This gallery variant contains image-only cards (no title/description), so the
 * text cell is left empty to keep a consistent 2-column structure.
 * Source: each card is <div class="utility-aspect-1x1"> wrapping a cover image.
 */
export default function parse(element, { document }) {
  const cells = [];

  const items = element.querySelectorAll(':scope > div');

  items.forEach((item) => {
    const img = item.querySelector('img');
    if (img) {
      cells.push([img, '']);
    }
  });

  // Empty-block guard.
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-gallery', cells });
  element.replaceWith(block);
}
