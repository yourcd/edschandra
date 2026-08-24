import { createOptimizedPicture } from '../../scripts/aem.js';

const DEFAULT_BG_COLOR = '#1a73e8'; // default blue

export default function decorate(block) {
  const rows = [...block.children];

  // Expected authoring order: [image row], [title row], [optional color row]
  const imageRow = rows[0];
  const titleRow = rows[1];
  const colorRow = rows[2];
  
  console.log("titleRow:=",titleRow);
   console.log("colorRow:=",colorRow);

  const img = imageRow ? imageRow.querySelector('img') : null;
  const titleText = titleRow ? titleRow.textContent.trim() : '';
  const colorText = colorRow ? colorRow.textContent.trim() : '';


 console.log("titleText:=",titleText);
 console.log("colorText:=",colorText);

  // Build optimized picture if an image was authored
  let picture = null;
  if (img) {
    picture = createOptimizedPicture(img.src, img.alt || titleText, false, [{ width: '1200' }]);
  }

  // Determine background color: use authored value if valid, else default blue
  const bgColor = isValidColor(colorText) ? colorText : DEFAULT_BG_COLOR;
  
  console.log("bgColor:=",bgColor);

  // Clear original authored content
  block.textContent = '';

  // Rebuild banner markup
  const imageWrapper = document.createElement('div');
  imageWrapper.className = 'banner-image';
  if (picture) imageWrapper.append(picture);

  const contentWrapper = document.createElement('div');
  contentWrapper.className = 'banner-content';

  const title = document.createElement('h1');
  title.className = 'banner-title';
  title.textContent = titleText;
  title.style.color = bgColor;
  contentWrapper.append(title);

  block.append(imageWrapper, contentWrapper);

  // Set background color via CSS custom property (CSS also defaults to blue as a fallback)
  //block.style.setProperty('--banner-bg-color', bgColor);
}

function isValidColor(value) {
  if (!value) return false;
  const s = new Option().style;
  s.color = '';
  s.color = value;
  return s.color !== '';
}
