export default function decorate(block) {
  // Tag rows: the one containing images is the media column, the other is text.
  [...block.children].forEach((row) => {
    const cell = row.firstElementChild;
    if (cell && cell.querySelector('picture')) {
      row.classList.add('hero-intro-media');
    } else {
      row.classList.add('hero-intro-text');
    }
  });

  const text = block.querySelector('.hero-intro-text');
  if (text) {
    const cell = text.firstElementChild;
    // Collect standalone link paragraphs into a single button group.
    const group = document.createElement('div');
    group.className = 'hero-intro-buttons';
    [...(cell ? cell.children : [])].forEach((el) => {
      const isLinkPara = el.tagName === 'P'
        && el.children.length === 1
        && el.firstElementChild.tagName === 'A';
      if (isLinkPara) {
        const a = el.firstElementChild;
        a.classList.add('hero-intro-btn');
        a.classList.add(group.children.length === 0 ? 'primary' : 'secondary');
        group.append(a);
        el.remove();
      }
    });
    if (group.children.length && cell) cell.append(group);
  }

  if (!block.querySelector('picture')) {
    block.classList.add('no-image');
  }
}
