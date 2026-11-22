import { ApplicationRef } from '@angular/core';

/** How long the anchor is kept in place after the update (web component previews and images render late). */
const pinDurationMs = 800;

/**
 * Applies a layout changing update (e.g. opening/closing a section editor) and keeps `anchor`
 * at the same position on screen by scrolling, so the element the user clicked doesn't jump
 * away when other content above it grows or shrinks.
 */
export function runLayoutTransition(appRef: ApplicationRef, update: () => void, anchor?: Element | null) {
  const anchorTop = anchor?.getBoundingClientRect().top;

  update();
  // render synchronously, so the new layout can be measured right away
  appRef.tick();
  if (anchor && anchorTop !== undefined) {
    pinAnchor(anchor, anchorTop);
  }
}

/**
 * Scrolls so `anchor` stays at `anchorTop` - right away and for a short while afterwards,
 * because some previews (web components, images) only get their final height later.
 * Stops as soon as the user scrolls themselves.
 */
function pinAnchor(anchor: Element, anchorTop: number) {
  const scroller = scrollParent(anchor);
  const end = performance.now() + pinDurationMs;
  let stopped = false;

  const stop = () => {
    stopped = true;
    scroller.removeEventListener('wheel', stop);
    scroller.removeEventListener('touchstart', stop);
  };
  scroller.addEventListener('wheel', stop, { passive: true });
  scroller.addEventListener('touchstart', stop, { passive: true });

  const keepInPlace = () => {
    if (stopped || !anchor.isConnected) return stop();
    const delta = anchor.getBoundingClientRect().top - anchorTop;
    if (Math.abs(delta) >= 1) scroller.scrollBy({ top: delta, behavior: 'instant' });
    if (performance.now() < end) requestAnimationFrame(keepInPlace);
    else stop();
  };
  keepInPlace();
}

function scrollParent(element: Element): Element {
  for (let parent = element.parentElement; parent; parent = parent.parentElement) {
    const overflowY = getComputedStyle(parent).overflowY;
    if ((overflowY === 'auto' || overflowY === 'scroll') && parent.scrollHeight > parent.clientHeight) {
      return parent;
    }
  }
  return document.scrollingElement ?? document.documentElement;
}
