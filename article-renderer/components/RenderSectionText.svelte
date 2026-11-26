<svelte:options
  customElement={{
    tag: "section-text",
    shadow: "none",
  }}
/>

<script lang="ts">
  import type { SectionText } from "sheltify-lib/article-types";
  import type { CmsAnimal, CmsTenantConfiguration } from "sheltify-lib/cms-types";
  import { resolveTenantPlaceholders } from "sheltify-lib/tenant-placeholders";
  import { resolveAnimalLinks } from "../util";

  let { section, allAnimalsByArticle, tenantConfig }: {
    section: SectionText,
    allAnimalsByArticle?: Record<string, CmsAnimal[]>,
    // replaces placeholders like "{{Address}}", inserted via "Vereinsfeld einfügen" in the text editor
    tenantConfig?: CmsTenantConfiguration,
  } = $props();

  const html = $derived(resolveTenantPlaceholders(resolveAnimalLinks(section.Content.Html, allAnimalsByArticle), tenantConfig));
</script>

{@html html}
