<svelte:options
  customElement={{
    tag: "section-home-found-feedback",
    shadow: "none",
  }}
/>

<script lang="ts">
  import type { SectionHomeFoundFeedback } from "sheltify-lib/article-types";

  let {section}: { section: SectionHomeFoundFeedback } = $props();
</script>

<div class="sui flex-x gap-2">
  {#each (section.TempData) as entry }
    <div class="entry sui p-2 flex-x">

      {#if entry.Content.MediaFiles?.length > 0}
      {/if}

      <b>{entry.AnimalName}</b>
      {@html entry.Content.Html}
    </div>
  {/each}
</div>
