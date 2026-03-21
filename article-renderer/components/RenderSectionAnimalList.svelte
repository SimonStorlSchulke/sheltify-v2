<svelte:options
  customElement={{
    tag: "section-animal-list",
    shadow: "none",
  }}
/>

<script lang="ts">
  import type { CmsAnimal } from 'sheltify-lib/cms-types';
  import AnimalCard from './AnimalCard.svelte';
  import type { SectionAnimalList } from "sheltify-lib/article-types";
  import { getAnimalLink } from '../util';
  let { section, allAnimalsByArticle }: { section: SectionAnimalList, allAnimalsByArticle?: Record<string, CmsAnimal[]>} = $props();

</script>

<div class="sui flex-x gap-2">
  {#each section.TempFoundAnimals as animal }
    <a href={getAnimalLink(animal, allAnimalsByArticle)}>
      <AnimalCard animal={animal} />
    </a>
  {/each}
</div>
