<svelte:options
  customElement={{
    tag: "section-text",
    shadow: "none",
  }}
/>

<script lang="ts">
  import type { SectionText } from "sheltify-lib/article-types";
  let { section }: { section: SectionText } = $props();
</script>

{@html section.Content.Html}
