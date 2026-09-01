/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-media. Base: columns.
 * Source: https://wknd-trendsetters.site/about-us
 * Generated: 2026-09-01
 *
 * Block library convention (columns): first row = block name; subsequent rows
 * have as many cells as visual columns. Column count derived from source: the
 * grid has 2 direct children (media column + text column), so one content row
 * with 2 cells.
 * Source: div > [ <div><img></div> , <div> breadcrumbs + heading + author meta </div> ].
 */
export default function parse(element, { document }) {
  // Direct children are the visual columns.
  const columns = Array.from(element.querySelectorAll(':scope > div'));

  // Build one content row from the column contents.
  const row = columns.map((col) => {
    const children = Array.from(col.childNodes).filter((n) => {
      // Keep element nodes and non-empty text nodes.
      return n.nodeType === 1 || (n.nodeType === 3 && n.textContent.trim());
    });
    if (children.length === 1) return children[0];
    return children.length ? children : '';
  });

  // Empty-block guard.
  if (!row.length || row.every((c) => c === '')) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [row];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-media', cells });
  element.replaceWith(block);
}
