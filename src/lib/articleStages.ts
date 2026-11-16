export function bindArticleStages(root: HTMLElement) {
  if (root.dataset.stageReady === 'true') return;

  const panels = [...root.querySelectorAll<HTMLElement>('[data-stage-panel]')];
  if (!panels.length) return;
  const headings = [...root.querySelectorAll<HTMLElement>('[data-interactive-copy] > .prose > h2')].slice(0, panels.length);
  const display = root.querySelector<HTMLElement>('.interactive-display');
  const stackedLayout = window.matchMedia('(max-width: 60rem)');
  let activeIndex = -1;
  let scrollQueued = false;

  panels.forEach((panel, index) => {
    panel.setAttribute('role', 'group');
    panel.setAttribute('aria-label', panel.dataset.label || headings[index]?.textContent?.trim() || `展示 ${index + 1}`);
  });

  const setStage = (index: number) => {
    const safeIndex = Math.max(0, Math.min(panels.length - 1, index));
    if (safeIndex === activeIndex) return;
    activeIndex = safeIndex;

    panels.forEach((panel, panelIndex) => {
      const selected = panelIndex === safeIndex;
      if (!selected && document.activeElement instanceof HTMLElement && panel.contains(document.activeElement)) {
        document.activeElement.blur();
      }
      panel.hidden = false;
      panel.dataset.stageActive = String(selected);
      panel.toggleAttribute('inert', !selected);
      panel.setAttribute('aria-hidden', String(!selected));
    });
  };

  const syncToReadingPosition = () => {
    scrollQueued = false;
    if (!headings.length) return;
    // On narrow screens, read below the sticky stage rather than behind it.
    const stageBottom = Math.max(0, display?.getBoundingClientRect().bottom ?? 0);
    const readingLine = stackedLayout.matches
      ? Math.min(window.innerHeight - 24, stageBottom + (window.innerHeight - stageBottom) * 0.2)
      : Math.min(window.innerHeight * 0.38, 360);
    let nextIndex = 0;
    headings.forEach((heading, index) => {
      if (heading.getBoundingClientRect().top <= readingLine) nextIndex = index;
    });
    setStage(nextIndex);
  };

  window.addEventListener('scroll', () => {
    if (scrollQueued) return;
    scrollQueued = true;
    window.requestAnimationFrame(syncToReadingPosition);
  }, { passive: true });
  stackedLayout.addEventListener('change', syncToReadingPosition);
  window.addEventListener('resize', syncToReadingPosition);

  root.dataset.stageReady = 'true';
  setStage(0);
  syncToReadingPosition();
}
