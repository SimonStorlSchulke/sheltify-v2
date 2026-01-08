<svelte:options
  customElement={{
    tag: "section-title",
    shadow: "none",
  }}
/>

<!-- components/Counter.svelte -->
<script lang="ts">
  import type { SectionTitle } from "sheltify-lib/article-types";
  let { section }: { section: SectionTitle } = $props();
  const anchor = $derived(() => section.Content.Anchor?.trim());
</script>

<svelte:element this={section.Content.Type} class="title">
  {section.Content.Text}

  {#if anchor()}
    <a
      id={anchor() ? `${anchor()}-link` : undefined}
      href={`#${anchor()}`}
      class="anchor-link"
      aria-label="Link zur Sektion kopieren"
      onclick={() =>
        navigator.clipboard.writeText(
          window.location.href.split("#")[0] + `#${anchor()}`,
        )}
    >
      #
    </a>
  {/if}
</svelte:element>
