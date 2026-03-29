<svelte:options
  customElement={{
    tag: "section-blogs",
    shadow: "none",
  }}
/>

<script lang="ts">
  import Image from './Image.svelte';
  import type { SectionBlogs } from "sheltify-lib/article-types";

  let {section}: { section: SectionBlogs } = $props();

  const allCategories = !section.Content.Categories || section.Content.Categories.length == 0;

  let selectedCategory = $state('');

  let entriesForCategory = $derived.by(() => {
    if (!selectedCategory) return section.TempBlogs;
    return section.TempBlogs.filter(blog => blog.Category == selectedCategory);
  })

  function encodeTitle(title: string) {
    return title
      .replace(/~/g, "~t")     // escape your escape char first
      .replace(/\?/g, "~q")
      .replace(/\//g, "~s")
      .replace(/%/g, "~p")
      .replace(/\s+/g, "-");
  }

  function pathFromTitle(title: string): string {
    return '/blog/' + encodeTitle(title);
  }

</script>

<div class="sui flex-y gap-3">
  <div class="sui flex-x wrap gap-2">
    {#if section.Content.ShowAllCategoriesButton}
      <button class={selectedCategory === '' ? 'primary' : 'secondary'} onclick={() => selectedCategory = ''}>Alle Artikel</button>
    {/if}

    <div class="button-group">
      {#if !allCategories}
        {#each section.Content.Categories as category}
          <button class:active={selectedCategory === category} onclick={() => selectedCategory = category}>{category}</button>
        {/each}
      {/if}
    </div>
  </div>

  <div class="sui flex-y gap-4">
    {#each entriesForCategory as entry}

      <a class="blogtile" href={pathFromTitle(entry.Title)}>
        <Image img={entry.Thumbnail} size={"medium"}/>
        <div class="tile-content sui flex-y pb-2 pt-3 pl-3 pr-3">
          <h3>{entry.Title}</h3>
          <span>{entry.Description}</span>
          <div class="sui grow-1"></div>
          <div class="sui flex-x space-between end-items w-100">
            <button class="secondary">Mehr erfahren</button>
          </div>
          <span class="date"></span>
        </div>
      </a>

    {/each}
  </div>
</div>
