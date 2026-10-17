<script lang="ts">

  import type { CmsImage } from 'sheltify-lib/cms-types';
  import { getImageSrc } from '../../util';

  let { images }: { images: CmsImage[] } = $props();

  let lightboxOpen = $state(false)
  let shownId: number = $state(0);

  let description = $derived(() => {
    const counter = `${(shownId ?? 0) + 1} / ${images.length}`;
    if (shownId === undefined || images[shownId].Description === '') return counter;
    const description = images[shownId].Description;
    if (description.length <= 150) return `${counter}<br>${description}`;
    return `${counter}<br>${images[shownId].Description.substring(0, 150)}...`;
  })

  export function open(id: number) {
    console.log("Wat")
    shownId = id;
    lightboxOpen = true;
  }

  function close() {
    lightboxOpen = false;
  }

  export function next(e?: MouseEvent) {
    e?.stopPropagation();
    if (shownId! >= images.length - 1) {
      shownId = 0;
      return;
    }
    shownId! += 1;
    console.log(shownId)
  }

  export function previous(e?: MouseEvent) {
    e?.stopPropagation();
    if (shownId! <= 0) {
      shownId = images.length - 1;
      return;
    }
    shownId! -= 1;
  }

  function onKeyDown(e: KeyboardEvent) {
    if (shownId === undefined) return;
    if (e.key == 'a' || e.key === 'ArrowLeft') previous();
    if (e.key == 'd' || e.key === 'ArrowRight') next();
    if (e.key === 'Escape') close();
  }

</script>
{#if lightboxOpen }
  <div onclick={close} class="lightbox" onkeyup={e => e.code === "Escape" ? close() : false} role="none">
    <div class="lightbox-content">
      <button class="previous" onclick={(e) => previous(e)}><span>‹</span></button>
      <div class="sui flex-y ai-center jc-space-evenly gap-3 w-100">
        <img src={getImageSrc(images[shownId], 'xlarge')} alt={images[shownId].Description || images[shownId].Title}>
        <span class="description sui text-center py-1">{@html description()}</span>
      </div>
      <button class="next" onclick={(e) => next(e)}><span>›</span></button>
    </div>
  </div>
{/if}

<svelte:window on:keydown={onKeyDown}/>
