import { createOptimizedPicture } from '../../scripts/aem.js';

const MONTHS = 'January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec';
const META_RE = new RegExp(`^(.*?)\\s+((?:${MONTHS})\\.?\\s+\\d{1,2}(?:,?\\s*\\d{4})?)$`, 'i');

export default function decorate(block) {
  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) div.className = 'cards-article-card-image';
      else div.className = 'cards-article-card-body';
    });

    // Split the meta paragraph ("Category May 12") into a tag pill + date.
    const body = li.querySelector('.cards-article-card-body');
    const metaP = body && body.querySelector('p');
    if (metaP) {
      const text = metaP.textContent.trim();
      metaP.textContent = '';
      metaP.className = 'cards-article-meta';
      const match = text.match(META_RE);
      if (match) {
        const tag = document.createElement('span');
        tag.className = 'cards-article-tag';
        tag.textContent = match[1].trim();
        const date = document.createElement('span');
        date.className = 'cards-article-date';
        date.textContent = match[2].trim();
        metaP.append(tag, date);
      } else {
        metaP.textContent = text;
      }
    }

    ul.append(li);
  });
  ul.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    img.closest('picture').replaceWith(optimizedPic);
  });
  block.textContent = '';
  block.append(ul);
}
