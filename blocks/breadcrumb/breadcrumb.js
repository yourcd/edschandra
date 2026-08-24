import { getMetadata } from '../../scripts/lib-franklin.js';

export default function decorate(block) {
  const title = getMetadata('og:title') || document.title;
  const pathname = window.location.pathname;

console.log('###pathname:='+pathname);
  const parts = pathname
    .split('/')
    .filter(Boolean);

  const trail = [
    {
      text: 'Home',
      link: '/',
    },
  ];

  let currentPath = '';

  parts.forEach((part, index) => {
    currentPath += `/${part}`;

    const isLast = index === parts.length - 1;

    trail.push({
      text: isLast ? title : formatLabel(part),
      link: isLast ? null : currentPath,
    });
  });

  const ul = document.createElement('ul');

  trail.forEach((step) => {
    const li = document.createElement('li');

    if (step.link) {
      const link = document.createElement('a');
      link.href = step.link;

      const span = document.createElement('span');
      span.textContent = step.text;

      link.append(span);
      li.append(link);
    } else {
      const span = document.createElement('span');
      span.textContent = step.text;
      li.append(span);
    }

    ul.append(li);
  });

  block.append(ul);
}

function formatLabel(value) {
	console.log('In FormatLabel function:='+value);
  return decodeURIComponent(value)
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}