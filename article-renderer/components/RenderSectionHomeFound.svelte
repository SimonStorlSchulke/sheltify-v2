<svelte:options
  customElement={{
    tag: "section-home-found",
    shadow: "none",
  }}
/>

<script lang="ts">
  import type { SectionHomeFound } from "sheltify-lib/article-types";
  let { section }: { section: SectionHomeFound} = $props();

</script>

<div class="sui flex-x gap-2">
  {#each section.TempData as animal }
    {animal.HomeFoundAt.Time}
  {/each}
</div>
