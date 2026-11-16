// Curated same-origin Labs only: iframe isolates CSS, not untrusted JavaScript.
(() => {
  if (window.parent === window) return;
  let frame;
  try { frame = window.frameElement; } catch { return; }
  if (!frame?.matches('[data-lab-frame]')) return;
  const root = document.documentElement;
  root.dataset.embedded = '';
  const sync = () => {
    const style = parent.getComputedStyle(parent.document.documentElement);
    for (const key of style) if (key.startsWith('--')) root.style.setProperty(key, style.getPropertyValue(key));
    root.style.colorScheme = style.colorScheme;
    root.style.fontFamily = style.fontFamily;
  };
  sync();
  const theme = new MutationObserver(sync);
  theme.observe(parent.document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'style'] });
  let resize;
  const start = () => {
    const update = () => { frame.style.height = `${Math.ceil(document.body.getBoundingClientRect().height) + 2}px`; };
    resize = new ResizeObserver(update);
    resize.observe(document.body);
    update();
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
  window.addEventListener('pagehide', () => { theme.disconnect(); resize?.disconnect(); }, { once: true });
})();
