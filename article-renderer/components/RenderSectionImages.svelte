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

  let {section}: { section: SectionImages } = $props();

  let lightBox: LightBox;

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
    if (cancelInterval) {
      clearInterval(intervalId);
    }
    shownId = (shownId + 1) % images().length;
  }

  function carouselPrevious(e?: MouseEvent, cancelInterval = true) {
    e?.stopPropagation();
    if (cancelInterval) {
      clearInterval(intervalId);
    }
    shownId = (shownId - 1 + images().length) % images().length;
  }

  function openLightBox(id: number) {
    console.log("EXX")
    if(layout() == "single" && section.Content.Link) {
      return;
    }
    lightBox.open(id);
  }

  function onKeyDown(e: KeyboardEvent) {
    if (shownId === undefined) return;
    if (e.key == 'a' || e.key === 'ArrowLeft') previous();
    if (e.key == 'd' || e.key === 'ArrowRight') next();
  }

  function next(e?: MouseEvent) {
    e?.stopPropagation();
    if (shownId! >= images().length - 1) {
      shownId = 0;
      return;
    }
    shownId! += 1;
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
{:else if layout() === "horizontal" || layout() === "vertical"}
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
{:else}
  <div class={`image-single count-${images.length} ${layout()} ${size()}`}>
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

<svelte:window on:keydown={onKeyDown}/>
