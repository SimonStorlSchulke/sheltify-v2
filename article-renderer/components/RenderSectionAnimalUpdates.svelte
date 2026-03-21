<svelte:options
  customElement={{
    tag: 'section-animal-updates',
    shadow: 'none',
  }}
/>

<script lang="ts">
  import type { CmsAnimal } from 'sheltify-lib/cms-types';
  import type { SectionAnimalUpdates } from 'sheltify-lib/article-types';
  import { getMultiAnimalTitle } from 'sheltify-lib/dist/animal-util';
  import { getImageSrc, getAnimalLink } from '../util';
  let { section, allAnimalsByArticle }: { section: SectionAnimalUpdates; allAnimalsByArticle?: Record<string, CmsAnimal[]> } = $props();
  const animalEntries = Object.entries(section.TempAnimalsByArticle);
</script>

<div class="sui flex-x gap-2 wrap">
  {#each animalEntries as [_, animals]}
    <a href={getAnimalLink(animals[0], allAnimalsByArticle)} class="sui update-entry flex-x">
      {#each animals as animal}
        {#if animal.Portrait}
        <img src={getImageSrc(animal.Portrait, 'small')} class="sui card-image" />
        {/if}
      {/each}
      <div class="sui flex-y gap-1 p-2">
        <b>{getMultiAnimalTitle(animals)}</b>
        <span>{animals[0].Article?.ContentUpdateNote}</span>
      </div>
    </a>
  {/each}
</div>
