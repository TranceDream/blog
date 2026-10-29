import { openDialog, syncDialogScrollLock } from '../lib/dialog';

type ViewerMedia = HTMLImageElement | HTMLVideoElement;

const MEDIA_SELECTOR = [
  '.prose img',
  'img.cover',
  'img[data-media-viewer]',
  'video[data-media-viewer]',
].join(',');

class SiteMediaViewer extends HTMLElement {
  private dialog: HTMLDialogElement | null = null;
  private stage: HTMLElement | null = null;
  private canvas: HTMLElement | null = null;
  private caption: HTMLElement | null = null;
  private count: HTMLElement | null = null;
  private announcement: HTMLElement | null = null;
  private previousButton: HTMLButtonElement | null = null;
  private nextButton: HTMLButtonElement | null = null;
  private closeButton: HTMLButtonElement | null = null;
  private fitButton: HTMLButtonElement | null = null;
  private actualButton: HTMLButtonElement | null = null;
  private sizeControls: HTMLElement | null = null;
  private originalLink: HTMLAnchorElement | null = null;
  private items: ViewerMedia[] = [];
  private index = 0;
  private returnFocus: HTMLElement | null = null;
  private controller: AbortController | null = null;
  private observer: MutationObserver | null = null;
  private videoTriggers = new WeakMap<HTMLElement, HTMLVideoElement>();
  private decorateQueued = false;

  connectedCallback() {
    this.dialog = this.querySelector('dialog');
    this.stage = this.querySelector('[data-media-stage]');
    this.canvas = this.querySelector('[data-media-canvas]');
    this.caption = this.querySelector('[data-media-caption]');
    this.count = this.querySelector('[data-media-count]');
    this.announcement = this.querySelector('[data-media-announcement]');
    this.previousButton = this.querySelector('[data-media-previous]');
    this.nextButton = this.querySelector('[data-media-next]');
    this.closeButton = this.querySelector('[data-media-close]');
    this.fitButton = this.querySelector('[data-media-fit]');
    this.actualButton = this.querySelector('[data-media-actual]');
    this.sizeControls = this.querySelector('[data-media-size-controls]');
    this.originalLink = this.querySelector('[data-media-original]');
    this.controller = new AbortController();
    const { signal } = this.controller;

    document.addEventListener('click', this.handleDocumentClick, { signal });
    document.addEventListener('keydown', this.handleKeydown, { signal });
    this.dialog?.addEventListener('click', this.handleDialogClick, { signal });
    this.dialog?.addEventListener('close', this.handleClose, { signal });
    this.previousButton?.addEventListener('click', () => this.show(this.index - 1), { signal });
    this.nextButton?.addEventListener('click', () => this.show(this.index + 1), { signal });
    this.closeButton?.addEventListener('click', () => this.dialog?.close(), { signal });
    this.fitButton?.addEventListener('click', () => this.setSize('fit'), { signal });
    this.actualButton?.addEventListener('click', () => this.setSize('actual'), { signal });
    this.canvas?.addEventListener('click', this.handleMediaClick, { signal });

    const main = document.querySelector('main');
    if (main) {
      this.observer = new MutationObserver(this.queueDecoration);
      this.observer.observe(main, {
        subtree: true,
        childList: true,
        attributes: true,
        attributeFilter: ['data-collapsible', 'data-expanded'],
      });
    }

    this.queueDecoration();
  }

  disconnectedCallback() {
    this.pauseCurrentVideo();
    if (this.dialog?.open) this.dialog.close();
    this.controller?.abort();
    this.observer?.disconnect();
    syncDialogScrollLock();
  }

  private queueDecoration = () => {
    if (this.decorateQueued) return;
    this.decorateQueued = true;
    requestAnimationFrame(() => {
      this.decorateQueued = false;
      this.decorate();
    });
  };

  private decorate() {
    document.querySelectorAll<ViewerMedia>(MEDIA_SELECTOR).forEach((media) => {
      if (!this.isEligible(media)) return;

      if (media instanceof HTMLImageElement) {
        const clipped = this.isClippedByCollapsedNote(media);
        if (clipped) {
          delete media.dataset.mediaViewerTrigger;
          media.dataset.mediaViewerClipped = 'true';
          media.removeAttribute('role');
          media.removeAttribute('aria-haspopup');
          media.removeAttribute('aria-controls');
          media.removeAttribute('aria-label');
          media.setAttribute('aria-hidden', 'true');
          media.tabIndex = -1;
          return;
        }

        if (media.dataset.mediaViewerClipped === 'true') {
          delete media.dataset.mediaViewerClipped;
          media.removeAttribute('aria-hidden');
        }
        media.dataset.mediaViewerTrigger = '';
        media.setAttribute('role', 'button');
        media.setAttribute('aria-haspopup', 'dialog');
        media.setAttribute('aria-controls', 'media-viewer-dialog');
        media.setAttribute('aria-label', this.triggerLabel(media));
        media.tabIndex = 0;
        return;
      }

      const existingButton = media.nextElementSibling instanceof HTMLButtonElement
        && media.nextElementSibling.matches('.media-viewer-open-media')
        ? media.nextElementSibling
        : null;
      const clipped = this.isClippedByCollapsedNote(media);
      if (clipped && existingButton) {
        delete existingButton.dataset.mediaViewerTrigger;
        existingButton.hidden = true;
        existingButton.tabIndex = -1;
        existingButton.setAttribute('aria-hidden', 'true');
        return;
      }
      if (clipped) return;
      if (existingButton) {
        existingButton.dataset.mediaViewerTrigger = '';
        existingButton.hidden = false;
        existingButton.tabIndex = 0;
        existingButton.removeAttribute('aria-hidden');
        this.videoTriggers.set(existingButton, media);
        return;
      }

      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'media-viewer-open-media';
      button.dataset.mediaViewerTrigger = '';
      button.textContent = '+ 在查看器中打开';
      button.setAttribute('aria-haspopup', 'dialog');
      button.setAttribute('aria-controls', 'media-viewer-dialog');
      button.setAttribute('aria-label', this.triggerLabel(media));
      this.videoTriggers.set(button, media);
      media.insertAdjacentElement('afterend', button);
    });
  }

  private isEligible(media: ViewerMedia) {
    if (media.dataset.mediaViewer === 'off') return false;
    if (media instanceof HTMLVideoElement) return media.hasAttribute('data-media-viewer');
    if (media.matches('.character-dialogue-image')) return false;
    if (!media.alt.trim() && !media.hasAttribute('data-media-viewer')) return false;
    if (media.closest('a, button') && !media.hasAttribute('data-media-viewer')) return false;
    return media.matches('.prose img, img.cover, img[data-media-viewer]');
  }

  private isClippedByCollapsedNote(media: ViewerMedia) {
    // Collapsed Notes hide their original images; expanded Notes hide thumbnail copies.
    if (!media.getClientRects().length) return true;
    const disclosure = media.closest<HTMLElement>('note-disclosure[data-collapsible][data-expanded="false"]');
    const content = disclosure?.querySelector<HTMLElement>('[data-note-content]');
    if (!content || !content.contains(media)) return false;
    const mediaRect = media.getBoundingClientRect();
    const contentRect = content.getBoundingClientRect();
    return mediaRect.top < contentRect.top - 1 || mediaRect.bottom > contentRect.bottom + 1;
  }

  private triggerLabel(media: ViewerMedia) {
    const label = media instanceof HTMLImageElement
      ? media.alt.trim()
      : media.getAttribute('aria-label')?.trim() || media.getAttribute('title')?.trim() || '';
    return label ? `在媒体查看器中打开：${label}` : '在媒体查看器中打开';
  }

  private handleDocumentClick = (event: MouseEvent) => {
    const target = event.target instanceof Element
      ? event.target.closest<HTMLElement>('[data-media-viewer-trigger]')
      : null;
    if (!target || this.contains(target)) return;
    const media = this.mediaFromTrigger(target);
    if (!media) return;
    event.preventDefault();
    this.open(media, target);
  };

  private handleKeydown = (event: KeyboardEvent) => {
    const target = event.target instanceof Element
      ? event.target.closest<HTMLElement>('[data-media-viewer-trigger]')
      : null;

    if (!this.dialog?.open && target && (event.key === 'Enter' || event.key === ' ')) {
      const media = this.mediaFromTrigger(target);
      if (!media) return;
      event.preventDefault();
      this.open(media, target);
      return;
    }

    if (!this.dialog?.open) return;
    if (event.metaKey || event.ctrlKey || event.altKey) return;
    if (
      event.target instanceof HTMLElement
      && (event.target.matches('video, input, textarea, select') || event.target.isContentEditable)
    ) return;
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      this.show(this.index - 1);
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      this.show(this.index + 1);
    } else if (event.key.toLowerCase() === 'f') {
      event.preventDefault();
      this.setSize('fit');
    } else if (event.key === '1') {
      event.preventDefault();
      this.setSize('actual');
    }
  };

  private mediaFromTrigger(trigger: HTMLElement): ViewerMedia | null {
    if (trigger instanceof HTMLImageElement) return trigger;
    return this.videoTriggers.get(trigger) ?? null;
  }

  private open(media: ViewerMedia, trigger: HTMLElement) {
    if (!this.dialog || this.dialog.open) return;
    const root = media.closest('[data-media-viewer-group]') ?? media.closest('article') ?? document.querySelector('main');
    this.items = root
      ? [...root.querySelectorAll<ViewerMedia>(MEDIA_SELECTOR)].filter((item) => (
          this.isEligible(item) && !this.isClippedByCollapsedNote(item)
        ))
      : [media];
    this.index = Math.max(0, this.items.indexOf(media));
    this.returnFocus = trigger;

    this.render();
    openDialog(this.dialog);
  }

  private show(index: number) {
    if (index < 0 || index >= this.items.length || index === this.index) return;
    this.index = index;
    this.render();
  }

  private render() {
    const media = this.items[this.index];
    if (!media || !this.canvas) return;
    this.pauseCurrentVideo();
    this.canvas.replaceChildren();
    this.setSize('fit');

    const source = this.mediaSource(media);
    if (media instanceof HTMLImageElement) {
      const image = new Image();
      image.className = 'media-viewer-media media-viewer-image';
      image.alt = media.alt;
      image.decoding = 'async';
      image.draggable = false;
      image.src = source;
      if (media.hasAttribute('data-pixelated')) image.dataset.pixelated = '';
      this.canvas.append(image);
      if (this.sizeControls) this.sizeControls.hidden = false;
    } else {
      const video = document.createElement('video');
      video.className = 'media-viewer-media media-viewer-video';
      video.controls = true;
      video.playsInline = true;
      video.preload = 'metadata';
      video.src = source;
      if (media.poster) video.poster = media.poster;
      const label = media.getAttribute('aria-label') || media.getAttribute('title');
      if (label) video.setAttribute('aria-label', label);
      this.canvas.append(video);
      if (this.sizeControls) this.sizeControls.hidden = true;
    }

    const visibleCaption = this.visibleCaption(media);
    if (this.caption) {
      this.caption.textContent = visibleCaption;
      this.caption.hidden = !visibleCaption;
    }
    this.dialog?.toggleAttribute('aria-describedby', Boolean(visibleCaption));
    if (visibleCaption) this.dialog?.setAttribute('aria-describedby', 'media-viewer-caption');
    const position = `${String(this.index + 1).padStart(2, '0')} / ${String(this.items.length).padStart(2, '0')}`;
    if (this.count) {
      this.count.textContent = position;
      this.count.hidden = this.items.length < 2;
    }
    for (const button of [this.previousButton, this.nextButton]) {
      if (button) button.hidden = this.items.length < 2;
    }
    if (this.announcement) {
      const label = this.mediaLabel(media);
      this.announcement.textContent = label ? `${position}，${label}` : `${position}，${media instanceof HTMLImageElement ? '图片' : '视频'}`;
    }
    if (this.previousButton) this.previousButton.disabled = this.index === 0;
    if (this.nextButton) this.nextButton.disabled = this.index === this.items.length - 1;
    if (this.originalLink) {
      this.originalLink.href = source;
      this.originalLink.hidden = source.startsWith('data:') || source.startsWith('blob:');
    }
  }

  private mediaSource(media: ViewerMedia) {
    if (media instanceof HTMLVideoElement) {
      const source = media.currentSrc || media.src || media.querySelector<HTMLSourceElement>('source[src]')?.src || '';
      return this.absoluteUrl(source);
    }

    const candidates = media.srcset
      .split(',')
      .map((candidate) => {
        const [url, descriptor = '0w'] = candidate.trim().split(/\s+/);
        const value = Number.parseFloat(descriptor);
        const score = descriptor.endsWith('x') ? value * 100000 : value;
        return { url, score: Number.isFinite(score) ? score : 0 };
      })
      .filter(({ url }) => Boolean(url))
      .sort((a, b) => a.score - b.score);
    const largest = candidates.at(-1)?.url;
    return this.absoluteUrl(largest || media.currentSrc || media.src);
  }

  private absoluteUrl(source: string) {
    try { return new URL(source, document.baseURI).href; }
    catch { return source; }
  }

  private visibleCaption(media: ViewerMedia) {
    const explicit = media.dataset.mediaCaption?.trim();
    if (explicit) return explicit;
    const figure = media.closest('figure');
    return figure?.querySelector<HTMLElement>(':scope > figcaption')?.textContent?.trim() ?? '';
  }

  private mediaLabel(media: ViewerMedia) {
    if (media instanceof HTMLImageElement) return media.alt.trim();
    return media.getAttribute('aria-label')?.trim() || media.getAttribute('title')?.trim() || '';
  }

  private setSize(size: 'fit' | 'actual') {
    if (!this.stage) return;
    this.stage.dataset.mediaSize = size;
    this.fitButton?.setAttribute('aria-pressed', String(size === 'fit'));
    this.actualButton?.setAttribute('aria-pressed', String(size === 'actual'));
    if (size === 'fit') this.stage.scrollTo({ top: 0, left: 0 });
  }

  private handleMediaClick = (event: MouseEvent) => {
    if (!(event.target instanceof HTMLImageElement)) return;
    this.setSize(this.stage?.dataset.mediaSize === 'actual' ? 'fit' : 'actual');
  };

  private handleDialogClick = (event: MouseEvent) => {
    const target = event.target;
    // Only the backdrop/canvas itself closes the viewer, never media or controls.
    if (target === this.dialog || target === this.stage || target === this.canvas
      || (target instanceof HTMLElement && target.matches('.media-viewer-frame'))) {
      this.dialog?.close();
    }
  };

  private pauseCurrentVideo() {
    const video = this.canvas?.querySelector('video');
    if (video) video.pause();
  }

  private handleClose = () => {
    this.pauseCurrentVideo();
    syncDialogScrollLock();
    const focusTarget = this.returnFocus;
    this.returnFocus = null;
    focusTarget?.focus({ preventScroll: true });
  };
}

if (!customElements.get('site-media-viewer')) {
  customElements.define('site-media-viewer', SiteMediaViewer);
}
