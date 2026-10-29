class NoteDisclosure extends HTMLElement {
  private content: HTMLElement | null = null;
  private toggle: HTMLButtonElement | null = null;
  private label: HTMLElement | null = null;
  private symbol: HTMLElement | null = null;
  private resizeObserver: ResizeObserver | null = null;
  private measureFrame: number | null = null;

  connectedCallback() {
    this.content = this.querySelector('[data-note-content]');
    this.toggle = this.querySelector('[data-note-toggle]');
    this.label = this.querySelector('[data-note-label]');
    this.symbol = this.querySelector('[data-note-symbol]');

    if (!this.content || !this.toggle) return;

    const thumbnails = this.querySelector<HTMLElement>('[data-note-thumbnails]');
    if (thumbnails) {
      thumbnails.replaceChildren();
      this.content.querySelectorAll<HTMLImageElement>('img:not(.character-dialogue-image)').forEach((image) => {
        const thumbnail = document.createElement('img');
        thumbnail.src = image.currentSrc || image.src;
        thumbnail.alt = image.alt;
        thumbnail.loading = 'lazy';
        thumbnail.dataset.mediaViewer = image.dataset.mediaViewer ?? '';
        thumbnails.append(thumbnail);
      });
      this.toggleAttribute('data-has-thumbnails', thumbnails.childElementCount > 0);
    }

    this.toggle.addEventListener('click', this.handleToggle);
    this.content.querySelectorAll('img').forEach((image) => {
      if (!image.complete) image.addEventListener('load', this.scheduleMeasure, { once: true });
    });

    this.resizeObserver = new ResizeObserver(this.scheduleMeasure);
    this.resizeObserver.observe(this.content);
    this.scheduleMeasure();
  }

  disconnectedCallback() {
    this.toggle?.removeEventListener('click', this.handleToggle);
    this.resizeObserver?.disconnect();
    if (this.measureFrame !== null) cancelAnimationFrame(this.measureFrame);
  }

  private scheduleMeasure = () => {
    if (this.measureFrame !== null) return;
    this.measureFrame = requestAnimationFrame(() => {
      this.measureFrame = null;
      this.measure();
    });
  };

  private measure = () => {
    if (!this.content || !this.toggle) return;
    if (this.dataset.expanded === 'true') return;

    const lineHeight = Number.parseFloat(getComputedStyle(this.content).lineHeight);
    if (!Number.isFinite(lineHeight)) return;

    const previewLines = Math.max(1, Number.parseInt(this.dataset.previewLines ?? '5', 10) || 5);
    const lineLimit = lineHeight * previewLines;
    let previewHeight = lineLimit;
    let previewSnapped = false;

    const structuredBlocks = this.content.querySelectorAll<HTMLElement>(
      ':scope > img, :scope > figure, :scope > pre, :scope > .expressive-code, :scope > table, :scope > blockquote, :scope > ul, :scope > ol',
    );
    const contentTop = this.content.getBoundingClientRect().top;

    for (const block of structuredBlocks) {
      const blockRect = block.getBoundingClientRect();
      const blockTop = blockRect.top - contentTop;
      const blockBottom = blockTop + blockRect.height;

      if (blockTop < lineLimit && blockBottom > lineLimit) {
        if (blockTop >= lineHeight) {
          previewHeight = blockTop;
          previewSnapped = true;
        }
        break;
      }
    }

    this.style.setProperty('--note-preview-height', `${previewHeight}px`);
    this.toggleAttribute('data-preview-snapped', previewSnapped);
    const textOverflows = this.content.scrollHeight > previewHeight + 2;
    this.toggleAttribute('data-text-overflow', textOverflows);
    const isCollapsible = this.hasAttribute('data-has-thumbnails') || textOverflows;
    this.toggleAttribute('data-collapsible', isCollapsible);
    this.toggle.hidden = !isCollapsible;

    if (!isCollapsible) this.setExpanded(false);
  };

  private setExpanded(expanded: boolean) {
    this.dataset.expanded = String(expanded);
    this.toggle?.setAttribute('aria-expanded', String(expanded));
    if (this.label) this.label.textContent = expanded ? '收起' : '展开全文';
    if (this.symbol) this.symbol.textContent = expanded ? '−' : '+';
  }

  private handleToggle = () => {
    const expanded = this.dataset.expanded === 'true';
    this.setExpanded(!expanded);
    this.scheduleMeasure();

    if (expanded && this.getBoundingClientRect().top < 0) {
      this.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };
}

if (!customElements.get('note-disclosure')) {
  customElements.define('note-disclosure', NoteDisclosure);
}
