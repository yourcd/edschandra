/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-intro. Base: hero.
 * Source: https://wknd-trendsetters.site/about-us
 * Generated: 2026-09-01
 *
 * Block library convention (hero): 1-column, 3-row table.
 *   Row 1: block name.
 *   Row 2 (1 cell): background image(s) (optional).
 *   Row 3 (1 cell): title, subheading, CTA (optional).
 * Source: grid with a text column (heading + subheading + button-group) and an
 * image column holding several cover images.
 */
export default function parse(element, { document }) {
  const cells = [];

  // Image row (optional) — collect all hero images.
  const images = Array.from(element.querySelectorAll('img.cover-image, img'));
  if (images.length) {
    cells.push([images]);
  }

  // Content row (single cell holding heading, subheading, CTAs).
  const contentCell = [];
  const heading = element.querySelector('h1, h2, h3, [class*="heading"]');
  if (heading) contentCell.push(heading);
  const subheading = element.querySelector('.subheading, p');
  if (subheading) contentCell.push(subheading);
  const ctas = Array.from(element.querySelectorAll('.button-group a, a.button'));
  contentCell.push(...ctas);

  // Empty-block guard.
  if (!heading && !subheading && !ctas.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  cells.push([contentCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-intro', cells });
  element.replaceWith(block);
}
