<svelte:options
  customElement={{
    tag: "section-images",
    shadow: "none",
  }}
/>

<script lang="ts">
  import LightBox from './shared/LightBox.svelte';
  import type { SectionImages } from 'sheltify-lib/dist/article-types';
  import { getImageSrc } from '../util';
  import { onMount } from "svelte";

  /** With more images the dots get too long - a counter is shown instead. */
  const maxDots = 12;

  let {section}: { section: SectionImages } = $props();

  let lightBox: LightBox;

  const images = $derived(() => section.Content.MediaFiles);
  const size = $derived(() => section.Content.Size);
  const layout = $derived(() => section.Content.Layout);

  let intervalId: number;

  onMount(() => {
    if (layout() !== "gallery") return;

    intervalId = setInterval(() => {
      showSlide(shownId + 1, false);
    }, 5000);

    return () => clearInterval(intervalId);
  });

  let shownId: number = $state(0);

  /** Shows slide `index` (wraps around). Manual navigation stops the autoplay. */
  function showSlide(index: number, cancelInterval = true, e?: Event) {
    e?.stopPropagation();
    if (cancelInterval) {
      clearInterval(intervalId);
    }
    const count = images().length;
    shownId = (index + count) % count;
  }

  function openLightBox(id: number) {
    if(layout() == "single" && section.Content.Link) {
      return;
    }
    lightBox.open(id);
  }
</script>


{#if layout() === "gallery"}
  <div class="image-carousel">
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

    {#if images().length > 1}
      <button class="carousel-button previous" onclick={(e) => showSlide(shownId - 1, true, e)} aria-label="Vorheriges Bild">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>
      </button>
      <button class="carousel-button next" onclick={(e) => showSlide(shownId + 1, true, e)} aria-label="Nächstes Bild">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg>
      </button>

      {#if images().length <= maxDots}
        <div class="carousel-dots">
          {#each images() as image, index}
            <button
              class="carousel-dot"
              class:active={index === shownId}
              onclick={(e) => showSlide(index, true, e)}
              aria-label={`Bild ${index + 1}`}
              aria-current={index === shownId}
            ></button>
          {/each}
        </div>
      {:else}
        <span class="carousel-counter">{shownId + 1} / {images().length}</span>
      {/if}
    {/if}
  </div>
{:else if layout() === "horizontal" || layout() === "vertical"}
  <div class={`image-grid count-${images().length} ${layout()} ${size()}`}>
    {#each images() as image, index}
      <img
        role="none"
        onclick={() => openLightBox(index)}
        src={getImageSrc(image, size())}
        alt={image.Description || image.Title}
      />
    {/each}
  </div>
{:else}
  <div class={`image-single count-${images().length} ${layout()} ${size()}`}>
    {#if section.Content.Link}
      <a href={section.Content.Link} rel="noopener noreferrer">
        <img
          src={getImageSrc(images()[0], size())}
          alt={images()[0].Description || images()[0].Title}
        />
      </a>
    {:else}
      <img
        role="none"
        onclick={() => openLightBox(0)}
        src={getImageSrc(images()[0], size())}
        alt={images()[0].Description || images()[0].Title}
      />
    {/if}
  </div>
{/if}

<LightBox images={images()} bind:this={lightBox} />
