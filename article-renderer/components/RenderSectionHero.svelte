<svelte:options
  customElement={{
    tag: "section-hero",
    shadow: "none",
  }}
/>

<script lang="ts">
  import Image from './Image.svelte';
  import type { SectionHero } from "sheltify-lib/dist/article-types";

  let { section }: { section: SectionHero } = $props();

  const duration = $derived(() => section.Content.DurationSeconds ?? 5);
  const effectiveImageCount = $derived(
    () => section.Content.MediaFiles.length + 1,
  );

  let scroller: HTMLDivElement;

  function initCarousel() {
    if (effectiveImageCount() > 2) {
      let index = 1;

      const interval = setInterval(() => {
        if(!scroller) {
          clearInterval(interval);
          return;
        }
        scroller.style.transition = "transform 1s";
        scroller.style.transform = `translateX(${-index * 100}%)`;
        index++;
        if (index === effectiveImageCount()) {
          // After the animation finishes, jump back without transition
          const timeout = setTimeout(() => {
            if(!scroller) {
              clearTimeout(timeout);
              return;
            }
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
      <Image
        img={image}
        size="xlarge"
        cssClass="hero-img"
        contain={true} refetch={true}
        cssStyle={`transform: translateX(${index * 100}%)`}
      />
    {/each}

    <Image
      img={section.Content.MediaFiles[0]}
      size="xlarge"
      cssClass="hero-img"
      contain={true} refetch={true}
      cssStyle={`transform: translateX(${section.Content.MediaFiles.length * 100}%)`}
    />
  </div>
  {#if section.Content.Text}
    <h1><span>{section.Content.Text}</span></h1>
  {/if}
</div>
