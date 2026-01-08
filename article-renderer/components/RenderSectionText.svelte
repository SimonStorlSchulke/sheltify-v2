<svelte:options
  customElement={{
    tag: "section-text",
    shadow: "none",
  }}
/>

<!-- components/Counter.svelte -->
<script lang="ts">
  import type { SectionText } from "sheltify-lib/article-types";
  let { section }: { section: SectionText } = $props();
</script>

{@html section.Content.Html}
