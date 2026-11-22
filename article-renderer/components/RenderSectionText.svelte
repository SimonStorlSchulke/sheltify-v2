<svelte:options
  customElement={{
    tag: "section-text",
    shadow: "none",
  }}
/>

<script lang="ts">
  import type { SectionText } from "sheltify-lib/article-types";
  import type { CmsAnimal } from "sheltify-lib/cms-types";
  import { resolveAnimalLinks } from "../util";

  let { section, allAnimalsByArticle }: { section: SectionText, allAnimalsByArticle?: Record<string, CmsAnimal[]> } = $props();

  const html = $derived(resolveAnimalLinks(section.Content.Html, allAnimalsByArticle));
</script>

{@html html}
