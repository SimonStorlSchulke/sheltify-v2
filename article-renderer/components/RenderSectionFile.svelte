<svelte:options
  customElement={{
    tag: "section-file",
    shadow: "none",
  }}
/>

<script lang="ts">
  import { downloadFile } from '../util';
  import type { SectionFile } from "sheltify-lib/article-types";

  let {section}: { section: SectionFile } = $props();
</script>

<div>
  {#if section.Content.File}
    {@const file = section.Content.File}
    <a on:click={() => downloadFile(file)}>herunterladen</a>
    {:else}
    <div>Datei nicht gefunden</div>
  {/if}
</div>