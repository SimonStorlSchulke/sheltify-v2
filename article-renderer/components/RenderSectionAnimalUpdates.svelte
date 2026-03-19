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
  import { getImageSrc } from '../util';
  let { section, allAnimalsByArticle }: { section: SectionAnimalUpdates; allAnimalsByArticle?: Record<string, CmsAnimal[]> } = $props();

  function getLink(animal: CmsAnimal) {
    if (!allAnimalsByArticle) {
      //link not needed for preview in CMS UI
      return null;
    }
    const animalsInArticle = allAnimalsByArticle[animal.ArticleID ?? ''];
    animalsInArticle.sort((a: CmsAnimal, b: CmsAnimal) => a.ID.localeCompare(b.ID));
    const names = animalsInArticle.map(animal => animal.Name).join('-');
    return `/${animalsInArticle[0].AnimalKind}/${names}`;
  }
</script>

<div class="sui flex-x gap-2 wrap">
  {#each Object.entries(section.TempAnimalsByArticle) as [_, animals]}
    <a href={getLink(animals[0])} class="sui update-entry flex-x">
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
