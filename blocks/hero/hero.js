// blocks/hero/hero.js

export default function decorate(block) {
  // Rows: :scope > div
  const rows = [...block.querySelectorAll(':scope > div')];

  // Parsed content model
  let headerText = '';
  let subHeaderText = '';
  let bodyText = '';
  let imageSrc = '';
  let imageAlt = '';
  let ctaLabel = '';
  let ctaHref = '';

  rows.forEach((row) => {
    const cols = [...row.children];
    if (cols.length === 0) return;

    const key = cols[0].textContent.trim().toLowerCase();
    const values = cols.slice(1).map((col) => col.textContent.trim());

    switch (key) {
      case 'header':
        headerText = values[0] || '';
        break;

      case 'sub-header':
      case 'subheader': // support minor variations
        subHeaderText = values[0] || '';
        break;

      case 'body':
        // Concatenate all values into a single body text
        bodyText = values.join('\n').trim();
        break;

      case 'image':
        imageSrc = values[0] || '';
        imageAlt = values[1] || headerText || '';
        break;

      case 'cta':
        ctaLabel = values[0] || '';
        ctaHref = values[1] || '';
        break;

      default:
        // Ignore unknown keys, or log for debugging
        break;
    }
  });

console.log('headerText:='+headerText);
console.log('subHeaderText:='+subHeaderText);
console.log('bodyText:='+bodyText);
console.log('imageSrc:='+imageSrc);
console.log('imageAlt:='+imageAlt);
console.log('ctaLabel:='+ctaLabel);
console.log('ctaHref:='+ctaHref);
 

  // Clear the original table-based markup
  block.innerHTML = '';

  // Wrapper for layout
  const heroInner = document.createElement('div');
  heroInner.classList.add('hero-inner');

  // Media column
  const media = document.createElement('div');
  media.classList.add('hero-media');

  if (imageSrc) {
    const picture = document.createElement('picture');
    const img = document.createElement('img');
    img.src = imageSrc;
    img.alt = imageAlt;
    img.loading = 'eager';
    picture.appendChild(img);
    media.appendChild(picture);
  }

  // Content column
  const content = document.createElement('div');
  content.classList.add('hero-content');

  if (subHeaderText) {
    const sub = document.createElement('p');
    sub.classList.add('hero-subheader');
    sub.textContent = subHeaderText;
    content.appendChild(sub);
  }

  if (headerText) {
    const heading = document.createElement('h1');
    heading.classList.add('hero-header');
    heading.textContent = headerText;
    content.appendChild(heading);
  }

  if (bodyText) {
    const body = document.createElement('p');
    body.classList.add('hero-body');
    body.textContent = bodyText;
    content.appendChild(body);
  }

  // CTA
  if (ctaLabel && ctaHref) {
    const ctaContainer = document.createElement('div');
    ctaContainer.classList.add('hero-cta');

    const cta = document.createElement('a');
    cta.classList.add('hero-cta-button');
    cta.href = ctaHref;
    cta.textContent = ctaLabel;

    ctaContainer.appendChild(cta);
    content.appendChild(ctaContainer);
  }

  heroInner.appendChild(media);
  heroInner.appendChild(content);

  block.appendChild(heroInner);
}