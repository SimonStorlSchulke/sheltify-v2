<svelte:options
  customElement={{
    tag: "section-hero",
    shadow: "none",
  }}
/>

<script lang="ts">
  import type { SectionHero } from "sheltify-lib/dist/article-types";
  import type { CmsImage, CmsImagesSize } from "sheltify-lib/dist/cms-types";
  import { getLargestAvailableImageSize } from "sheltify-lib/image-utils";

  let { section, uploadsUrl }: { section: SectionHero; uploadsUrl: string } = $props();

  function getImageSrc(image: CmsImage, requestedSize: CmsImagesSize): string {
    const availableSize = getLargestAvailableImageSize(requestedSize, image);
    return `${uploadsUrl}${image.ID}_${availableSize}.webp`;
  }

  const duration = $derived(() => section.Content.DurationSeconds ?? 5);
  const effectiveImageCount = $derived(
    () => section.Content.MediaFiles.length + 1,
  );

  let scroller: HTMLDivElement;

  function initCarousel() {
    if (effectiveImageCount() > 2) {
      let index = 1;

      setInterval(() => {
        scroller.style.transition = "transform 1s";
        scroller.style.transform = `translateX(${-index * 100}%)`;
        index++;

        if (index === effectiveImageCount()) {
          // After the animation finishes, jump back without transition
          setTimeout(() => {
            scroller.style.transition = "none";
            scroller.style.transform = "translateX(0%)";
            index = 1;
          }, 1000);
        }
      }, duration() * 1000);
    }
  }

  let isTopHero = $state<boolean>(false);

  $effect(() => {
    const firstScroller = document.querySelector('.hero-scroller');
    isTopHero = scroller == firstScroller;
    initCarousel();
  });
</script>

<div class={"hero-container" + (isTopHero ? " top-hero" : "")}>
  <div class="hero-scroller" bind:this={scroller}>
    {#each section.Content.MediaFiles as image, index}
      <img
        class="hero-img"
        src={getImageSrc(image, "xlarge")}
        alt={image.Description || image.Title}
        style={`transform: translateX(${index * 100}%)`}
      />
    {/each}

    <img
      style={`transform: translateX(${section.Content.MediaFiles.length * 100}%)`}
      class="hero-img"
      alt={section.Content.MediaFiles[0].Description ||
        section.Content.MediaFiles[0].Title}
      src={getImageSrc(section.Content.MediaFiles[0], "xlarge")}
    />
  </div>
  {#if section.Content.Text}
    <h1><span>{section.Content.Text}</span></h1>
  {/if}
</div>
