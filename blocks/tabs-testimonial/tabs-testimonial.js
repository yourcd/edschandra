// eslint-disable-next-line import/no-unresolved
import { toClassName } from '../../scripts/aem.js';

export default async function decorate(block) {
  // build tablist
  const tablist = document.createElement('div');
  tablist.className = 'tabs-testimonial-list';
  tablist.setAttribute('role', 'tablist');

  // each row = one testimonial: cell 1 -> tab label, cell 2 -> panel content
  const tabs = [...block.children].map((child) => child.firstElementChild);
  tabs.forEach((tab, i) => {
    const id = toClassName(tab.textContent);

    // decorate tabpanel (the row itself)
    const tabpanel = block.children[i];
    tabpanel.className = 'tabs-testimonial-panel';
    tabpanel.id = `tabpanel-${id}`;
    tabpanel.setAttribute('aria-hidden', !!i);
    tabpanel.setAttribute('aria-labelledby', `tab-${id}`);
    tabpanel.setAttribute('role', 'tabpanel');

    // restructure the panel's content cell into image + text columns
    const content = tabpanel.lastElementChild; // second cell (after tab label cell)
    if (content) {
      content.classList.add('tabs-testimonial-panel-content');
      const picture = content.querySelector('picture');
      if (picture) {
        const imageCol = document.createElement('div');
        imageCol.className = 'tabs-testimonial-panel-image';
        const pic = picture.closest('p') || picture;
        imageCol.append(pic);

        const textCol = document.createElement('div');
        textCol.className = 'tabs-testimonial-panel-text';
        while (content.firstElementChild) {
          textCol.append(content.firstElementChild);
        }
        content.append(imageCol, textCol);
      }
    }

    // build tab button from the label cell
    const button = document.createElement('button');
    button.className = 'tabs-testimonial-tab';
    button.id = `tab-${id}`;
    button.innerHTML = tab.innerHTML;
    button.setAttribute('aria-controls', `tabpanel-${id}`);
    button.setAttribute('aria-selected', !i);
    button.setAttribute('role', 'tab');
    button.setAttribute('type', 'button');
    button.addEventListener('click', () => {
      block.querySelectorAll('[role=tabpanel]').forEach((panel) => {
        panel.setAttribute('aria-hidden', true);
      });
      tablist.querySelectorAll('button').forEach((btn) => {
        btn.setAttribute('aria-selected', false);
      });
      tabpanel.setAttribute('aria-hidden', false);
      button.setAttribute('aria-selected', true);
    });
    tablist.append(button);
    tab.remove();
  });

  // tablist rendered below the panels (matches source layout)
  block.append(tablist);
}
