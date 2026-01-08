<svelte:options
  customElement={{
    tag: "section-images",
    shadow: "none",
  }}
/>

<script lang="ts">
  import { getLargestAvailableImageSize } from 'sheltify-lib/image-utils';
  import type { SectionImages } from 'sheltify-lib/dist/article-types';
  import { type CmsImage, type CmsImagesSize } from 'sheltify-lib/dist/cms-types';

  let {section, uploadsUrl}: { section: SectionImages, uploadsUrl: string } = $props();

  const images = $derived(() => section.Content.MediaFiles);
  const size = $derived(() => section.Content.Size);
  const layout = $derived(() => section.Content.Layout);

  let shownId: number | undefined = $state();

  function getImageSrc(image: CmsImage, requestedSize: CmsImagesSize): string {
    const availableSize = getLargestAvailableImageSize(requestedSize, image);
    return `${uploadsUrl}${image.ID}_${availableSize}.webp`;
  }

  let description = $derived(() => {
    const counter = `${(shownId ?? 0) + 1} / ${images.length}`;
    if (shownId === undefined || images()[shownId].Description === '') return counter;
    const description = images()[shownId].Description;
    if (description.length <= 150) return `${counter}<br>${description}`;
    return `${counter}<br>${images()[shownId].Description.substring(0, 150)}...`;
  })

  function openLightBox(id: number) {
    shownId = id;
  }

  function closeLightBox() {
    shownId = undefined;
  }

  function onKeyDown(e: KeyboardEvent) {
    if (shownId === undefined) return;
    if (e.key == 'a' || e.key === 'ArrowLeft') previous();
    if (e.key == 'd' || e.key === 'ArrowRight') next();
    if (e.key === 'Escape') closeLightBox();
  }

  function next(e?: MouseEvent) {
    e?.stopPropagation();
    if (shownId! >= images.length - 1) {
      shownId = 0;
      return;
    }
    shownId! += 1;
  }

  function previous(e?: MouseEvent) {
    e?.stopPropagation();
    if (shownId! <= 0) {
      shownId = images.length - 1;
      return;
    }
    shownId! -= 1;
  }

</script>


<div class={`image-grid count-${images.length} ${layout()} ${size()}`}>
  {#each images() as image, index}
    <img on:click={() => openLightBox(index)} src={getImageSrc(image, size())} alt={image.Description || image.Title}>
  {/each}
</div>

{#if shownId !== undefined}
  <div on:click={closeLightBox} class="lightbox">
    <div class="lightbox-content">
      <button class="previous" on:click={(e) => previous(e)}><span>‹</span></button>
      <div class="sui flex-y ai-center jc-space-evenly gap-3 w-100">
        <img src={getImageSrc(images()[shownId], 'xlarge')} alt={images()[shownId].Description || images()[shownId].Title}>
        <span class="description sui text-center py-1">{@html description()}</span>
      </div>
      <button class="next" on:click={(e) => next(e)}><span>›</span></button>
    </div>
  </div>
{/if}

<svelte:window on:keydown={onKeyDown}/>