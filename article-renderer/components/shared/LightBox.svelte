<script lang="ts">
  import type { CmsImage } from 'sheltify-lib/cms-types';
  import { getImageSrc } from '../../util';

  let { images }: { images: CmsImage[] } = $props();

  const minScale = 1;
  const maxScale = 5;
  const clickZoomScale = 2.5;

  let lightboxOpen = $state(false);
  let shownId: number = $state(0);

  // zoom & pan
  let scale = $state(1);
  let tx = $state(0);
  let ty = $state(0);
  let isDragging = $state(false);

  let stage: HTMLDivElement | undefined = $state();
  let imageElement: HTMLImageElement | undefined = $state();

  const image = $derived(images[shownId]);
  const isZoomed = $derived(scale > 1.01);

  /** Moves the lightbox to <body>, so no transformed parent breaks position: fixed. */
  function portal(node: HTMLElement) {
    document.body.appendChild(node);
    return { destroy: () => node.remove() };
  }

  export function open(id: number) {
    shownId = id;
    resetZoom();
    lightboxOpen = true;
    document.documentElement.style.overflow = 'hidden';
  }

  function close() {
    lightboxOpen = false;
    document.documentElement.style.overflow = '';
  }

  export function next(e?: Event) {
    e?.stopPropagation();
    shownId = (shownId + 1) % images.length;
    resetZoom();
  }

  export function previous(e?: Event) {
    e?.stopPropagation();
    shownId = (shownId - 1 + images.length) % images.length;
    resetZoom();
  }

  // --- zoom ------------------------------------------------------------------

  function resetZoom() {
    scale = 1;
    tx = 0;
    ty = 0;
  }

  /** Zooms to `newScale`, keeping the point (x, y) (relative to the stage center) in place. */
  function zoomTo(newScale: number, x = 0, y = 0) {
    const clamped = Math.min(maxScale, Math.max(minScale, newScale));
    if (clamped <= minScale) {
      resetZoom();
      return;
    }
    const factor = clamped / scale;
    tx = x - (x - tx) * factor;
    ty = y - (y - ty) * factor;
    scale = clamped;
    clampPan();
  }

  function zoomBy(factor: number, e?: Event) {
    e?.stopPropagation();
    zoomTo(scale * factor);
  }

  /** Keeps the zoomed image covering the stage instead of panning it out of view. */
  function clampPan() {
    if (!stage || !imageElement) return;
    const maxX = Math.max(0, (imageElement.offsetWidth * scale - stage.clientWidth) / 2);
    const maxY = Math.max(0, (imageElement.offsetHeight * scale - stage.clientHeight) / 2);
    tx = Math.min(maxX, Math.max(-maxX, tx));
    ty = Math.min(maxY, Math.max(-maxY, ty));
  }

  function pointFromEvent(e: { clientX: number, clientY: number }) {
    const rect = stage!.getBoundingClientRect();
    return { x: e.clientX - rect.left - rect.width / 2, y: e.clientY - rect.top - rect.height / 2 };
  }

  function onWheel(e: WheelEvent) {
    e.preventDefault();
    const { x, y } = pointFromEvent(e);
    zoomTo(scale * Math.exp(-e.deltaY * 0.0015), x, y);
  }

  /** Click on the image: zoom in at the clicked point, or back out when already zoomed. */
  function toggleZoomAt(e: { clientX: number, clientY: number }) {
    if (isZoomed) {
      resetZoom();
    } else {
      const { x, y } = pointFromEvent(e);
      zoomTo(clickZoomScale, x, y);
    }
  }

  // the wheel listener must not be passive, otherwise preventDefault doesn't stop page scrolling
  $effect(() => {
    if (!stage) return;
    stage.addEventListener('wheel', onWheel, { passive: false });
    return () => stage?.removeEventListener('wheel', onWheel);
  });

  // --- pointer: pan, pinch, swipe, tap ---------------------------------------

  const pointers = new Map<number, { x: number, y: number }>();
  let gesture: {
    startX: number, startY: number, startTx: number, startTy: number,
    pinchDistance?: number, pinchScale?: number, moved: boolean,
  } | null = null;

  function distance() {
    const [a, b] = [...pointers.values()];
    return Math.hypot(a.x - b.x, a.y - b.y);
  }

  function onPointerDown(e: PointerEvent) {
    try {
      stage!.setPointerCapture(e.pointerId);
    } catch {
      // pointer already gone - the gesture still works without capture
    }
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    gesture = { startX: e.clientX, startY: e.clientY, startTx: tx, startTy: ty, moved: gesture?.moved ?? false };
    if (pointers.size === 2) {
      gesture.pinchDistance = distance();
      gesture.pinchScale = scale;
    }
  }

  function onPointerMove(e: PointerEvent) {
    if (!gesture || !pointers.has(e.pointerId)) return;
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pointers.size === 2 && gesture.pinchDistance) {
      const [a, b] = [...pointers.values()];
      const { x, y } = pointFromEvent({ clientX: (a.x + b.x) / 2, clientY: (a.y + b.y) / 2 });
      zoomTo(gesture.pinchScale! * distance() / gesture.pinchDistance, x, y);
      gesture.moved = true;
      return;
    }

    const dx = e.clientX - gesture.startX;
    const dy = e.clientY - gesture.startY;
    if (Math.hypot(dx, dy) > 4) gesture.moved = true;
    if (isZoomed) {
      isDragging = true;
      tx = gesture.startTx + dx;
      ty = gesture.startTy + dy;
      clampPan();
    }
  }

  function onPointerUp(e: PointerEvent) {
    if (!gesture || !pointers.has(e.pointerId)) return;
    pointers.delete(e.pointerId);
    if (pointers.size > 0) return;

    const dx = e.clientX - gesture.startX;
    const dy = e.clientY - gesture.startY;
    const wasMoved = gesture.moved;
    gesture = null;
    isDragging = false;

    // swipe to navigate (only when not zoomed)
    if (!isZoomed && Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      dx < 0 ? next() : previous();
      return;
    }
    if (wasMoved) return;
    // tap on the image zooms, tap next to it closes the lightbox
    if (isOnImage(e)) toggleZoomAt(e);
    else close();
  }

  function isOnImage(e: PointerEvent): boolean {
    const rect = imageElement?.getBoundingClientRect();
    return !!rect && e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom;
  }

  // --- keyboard --------------------------------------------------------------

  function onKeyDown(e: KeyboardEvent) {
    if (!lightboxOpen) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowLeft') previous();
    else if (e.key === 'ArrowRight') next();
    else if (e.key === '+' || e.key === '=') zoomBy(1.5);
    else if (e.key === '-') zoomBy(1 / 1.5);
    else if (e.key === '0') resetZoom();
  }
</script>

{#if lightboxOpen && image}
  <div class="lightbox" use:portal role="dialog" aria-modal="true" aria-label="Bildansicht">
    <div class="lightbox-topbar">
      <span class="lightbox-counter">{shownId + 1} / {images.length}</span>
      <div class="lightbox-actions">
        <button class="lightbox-icon-button" onclick={(e) => zoomBy(1 / 1.5, e)} class:is-disabled={!isZoomed} aria-disabled={!isZoomed} aria-label="Verkleinern" title="Verkleinern (−)">
          <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M8 11h6M20 20l-4-4"/></svg>
        </button>
        <button class="lightbox-icon-button" onclick={(e) => zoomBy(1.5, e)} class:is-disabled={scale >= maxScale} aria-disabled={scale >= maxScale} aria-label="Vergrößern" title="Vergrößern (+)">
          <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M8 11h6M11 8v6M20 20l-4-4"/></svg>
        </button>
        <button class="lightbox-icon-button" onclick={close} aria-label="Schließen" title="Schließen (Esc)">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>
        </button>
      </div>
    </div>

    <div
      class="lightbox-stage"
      class:zoomed={isZoomed}
      class:dragging={isDragging}
      bind:this={stage}
      onpointerdown={onPointerDown}
      onpointermove={onPointerMove}
      onpointerup={onPointerUp}
      onpointercancel={onPointerUp}
      role="none"
    >
      {#key shownId}
        <img
          bind:this={imageElement}
          src={getImageSrc(image, 'xlarge')}
          alt={image.Description || image.Title}
          draggable="false"
          style={`transform: translate(${tx}px, ${ty}px) scale(${scale});`}
        >
      {/key}
    </div>

    {#if images.length > 1}
      <button class="lightbox-nav previous" onclick={(e) => previous(e)} aria-label="Vorheriges Bild">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>
      </button>
      <button class="lightbox-nav next" onclick={(e) => next(e)} aria-label="Nächstes Bild">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg>
      </button>
    {/if}

    {#if image.Description}
      <p class="lightbox-caption">{image.Description}</p>
    {/if}
  </div>
{/if}

<svelte:window onkeydown={onKeyDown}/>
