<svelte:options
  customElement={{
    tag: "section-home-found",
    shadow: "none",
  }}
/>

<script lang="ts">
  import Image from './shared/Image.svelte';
  import type { SectionHomeFound } from "sheltify-lib/article-types";
  let { section }: { section: SectionHomeFound} = $props();

</script>

<div class="sui flex-x gap-2">
  {#each section.TempData as animal }
    <div class="home-found-card">
      <Image img={animal.Portrait} size="medium"/>
    {animal.HomeFoundAt.Time}
      <span>{animal.Name}</span>
    </div>
  {/each}
</div>
