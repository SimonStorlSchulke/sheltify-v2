<svelte:options
  customElement={{
    tag: "section-images",
    shadow: "none",
  }}
/>

<script lang="ts">
  import type { SectionImages } from 'sheltify-lib/dist/article-types';
  import { getImageSrc } from '../util';
  import { onMount } from "svelte";

  let {section}: { section: SectionImages } = $props();

  const images = $derived(() => section.Content.MediaFiles);
  const size = $derived(() => section.Content.Size);
  const layout = $derived(() => section.Content.Layout);

  let intervalId: number;

  onMount(() => {
    if (layout() !== "gallery") return;

    intervalId = setInterval(() => {
      carouselNext();
    }, 5000);

    return () => clearInterval(intervalId);
  });

  let lightboxOpen = $state(false)
  let shownId: number = $state(0);

  let description = $derived(() => {
    const counter = `${(shownId ?? 0) + 1} / ${images.length}`;
    if (shownId === undefined || images()[shownId].Description === '') return counter;
    const description = images()[shownId].Description;
    if (description.length <= 150) return `${counter}<br>${description}`;
    return `${counter}<br>${images()[shownId].Description.substring(0, 150)}...`;
  })

  function carouselNext(e?: MouseEvent, cancelInterval = true) {
    e?.stopPropagation();
    if(cancelInterval) {
      clearInterval(intervalId);
    }
    shownId = (shownId + 1) % images().length;
  }

  function carouselPrevious(e?: MouseEvent, cancelInterval = true) {
    e?.stopPropagation();
    if(cancelInterval) {
      clearInterval(intervalId);
    }
    shownId = (shownId - 1 + images().length) % images().length;
  }

  function openLightBox(id: number) {
    shownId = id;
    lightboxOpen = true;
  }

  function closeLightBox() {
    lightboxOpen = false;
  }

  function onKeyDown(e: KeyboardEvent) {
    if (shownId === undefined) return;
    if (e.key == 'a' || e.key === 'ArrowLeft') previous();
    if (e.key == 'd' || e.key === 'ArrowRight') next();
    if (e.key === 'Escape') closeLightBox();
  }

  function next(e?: MouseEvent) {
    e?.stopPropagation();
    if (shownId! >= images().length - 1) {
      shownId = 0;
      return;
    }
    shownId! += 1;
    console.log(shownId)
  }

  function previous(e?: MouseEvent) {
    e?.stopPropagation();
    if (shownId! <= 0) {
      shownId = images().length - 1;
      return;
    }
    shownId! -= 1;
    console.log(shownId)
  }
</script>


{#if layout() === "gallery"}
  <div class="image-carousel">
    <button
      class="carousel-button previous"
      onclick={carouselPrevious}>
      ‹
    </button>
    <div class="viewport">
      <div
        class="track"
        style={`transform: translateX(-${shownId * 100}%);`}
      >
        {#each images() as image, index}
          <img
            role="none"
            alt={image.Description || image.Title}
            src={getImageSrc(image, 'large')} onclick={() => openLightBox(index)}
          />
        {/each}
      </div>
    </div>
    <button
      class="carousel-button next"
      onclick={carouselNext}>
      ›
    </button>
  </div>
{:else}
  <div class={`image-grid count-${images.length} ${layout()} ${size()}`}>
    {#each images() as image, index}
      <img
        role="none"
        onclick={() => openLightBox(index)}
        src={getImageSrc(image, size())}
        alt={image.Description || image.Title}
      />
    {/each}
  </div>
{/if}

{#if lightboxOpen }
  <div onclick={closeLightBox} class="lightbox" onkeyup={e => e.code === "Escape" ? closeLightBox() : false} role="none">
    <div class="lightbox-content">
      <button class="previous" onclick={(e) => previous(e)}><span>‹</span></button>
      <div class="sui flex-y ai-center jc-space-evenly gap-3 w-100">
        <img src={getImageSrc(images()[shownId], 'xlarge')} alt={images()[shownId].Description || images()[shownId].Title}>
        <span class="description sui text-center py-1">{@html description()}</span>
      </div>
      <button class="next" onclick={(e) => next(e)}><span>›</span></button>
    </div>
  </div>
{/if}

<svelte:window on:keydown={onKeyDown}/>
