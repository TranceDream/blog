let instanceCount = 0;

export function bindArticleStages(root: HTMLElement) {
  if (root.dataset.stageReady === 'true') return;

  const tablist = root.querySelector<HTMLElement>('[data-stage-tabs]');
  const steps = [...root.querySelectorAll<HTMLButtonElement>('[data-stage-step]')];
  const panels = [...root.querySelectorAll<HTMLElement>('[data-stage-panel]')];
  const stageCount = Math.min(steps.length, panels.length);
  if (!tablist || stageCount === 0) return;

  const headings = [...root.querySelectorAll<HTMLElement>('[data-interactive-copy] > .prose > h2')].slice(0, stageCount);
  const stackedLayout = window.matchMedia('(max-width: 60rem)');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const idPrefix = root.id || `article-stages-${++instanceCount}`;
  let activeIndex = -1;
  let scrollQueued = false;
  let programmaticScroll = false;
  let scrollUnlockTimer: number | undefined;

  tablist.setAttribute('role', 'tablist');
  steps.forEach((step, index) => {
    const panel = panels[index];
    if (!panel) return;
    step.id = `${idPrefix}-step-${index}`;
    step.setAttribute('role', 'tab');
    step.setAttribute('aria-controls', `${idPrefix}-panel-${index}`);
    panel.id = `${idPrefix}-panel-${index}`;
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', step.id);
  });

  const setStage = (index: number) => {
    const safeIndex = Math.max(0, Math.min(stageCount - 1, index));
    if (safeIndex === activeIndex) return;
    activeIndex = safeIndex;

    panels.forEach((panel, panelIndex) => {
      const selected = panelIndex === safeIndex;
      panel.hidden = false;
      panel.dataset.stageActive = String(selected);
      panel.toggleAttribute('inert', !selected);
      panel.setAttribute('aria-hidden', String(!selected));
    });
    steps.forEach((step, stepIndex) => {
      const selected = stepIndex === safeIndex;
      step.setAttribute('aria-selected', String(selected));
      step.tabIndex = selected ? 0 : -1;
    });
  };

  const chooseStage = (index: number) => {
    setStage(index);
    const heading = headings[index];
    if (!stackedLayout.matches && heading) {
      programmaticScroll = true;
      scheduleScrollUnlock(900);
      heading.scrollIntoView({
        behavior: reducedMotion.matches ? 'auto' : 'smooth',
        block: 'start',
      });
    }
  };

  const scheduleScrollUnlock = (delay: number) => {
    window.clearTimeout(scrollUnlockTimer);
    scrollUnlockTimer = window.setTimeout(() => {
      programmaticScroll = false;
      syncToReadingPosition();
    }, delay);
  };

  steps.forEach((step, index) => {
    step.addEventListener('click', () => chooseStage(index));
    step.addEventListener('keydown', (event) => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      const nextIndex = event.key === 'Home'
        ? 0
        : event.key === 'End'
          ? stageCount - 1
          : (activeIndex + (event.key === 'ArrowRight' ? 1 : -1) + stageCount) % stageCount;
      steps[nextIndex]?.focus();
      chooseStage(nextIndex);
    });
  });

  const syncToReadingPosition = () => {
    scrollQueued = false;
    if (!headings.length || stackedLayout.matches) return;
    if (panels.some((panel) => panel.contains(document.activeElement))) return;
    const readingLine = Math.min(window.innerHeight * 0.38, 360);
    let nextIndex = 0;
    headings.forEach((heading, index) => {
      if (heading.getBoundingClientRect().top <= readingLine) nextIndex = index;
    });
    setStage(nextIndex);
  };

  window.addEventListener('scroll', () => {
    if (programmaticScroll) {
      scheduleScrollUnlock(140);
      return;
    }
    if (scrollQueued) return;
    scrollQueued = true;
    window.requestAnimationFrame(syncToReadingPosition);
  }, { passive: true });
  stackedLayout.addEventListener('change', syncToReadingPosition);

  root.dataset.stageReady = 'true';
  setStage(0);
  syncToReadingPosition();
}
