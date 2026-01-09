<svelte:options
  customElement={{
    tag: "section-animal-list",
    shadow: "none",
  }}
/>

<script lang="ts">
  import type { CmsAnimal } from 'sheltify-lib/dist/cms-types';
  import AnimalCard from './AnimalCard.svelte';
  import type { SectionAnimalList } from "sheltify-lib/article-types";
  let { section, allAnimalsByArticle }: { section: SectionAnimalList, allAnimalsByArticle: Record<string, CmsAnimal[]>} = $props();

  function getLink(animal: CmsAnimal) {
    const animalsInArticle = allAnimalsByArticle[animal.ArticleID ?? ''];
    animalsInArticle.sort((a: CmsAnimal, b: CmsAnimal) => a.ID.localeCompare(b.ID));
    const names = animalsInArticle.map((animal) => animal.Name).join('-');
    return `/${animalsInArticle[0].AnimalKind}/${names}`
  }

</script>

<div class="sui flex-x gap-2">
  {#each section.TempFoundAnimals as animal }
    <a href={getLink(animal)}>
      <AnimalCard animal={animal} />
    </a>
  {/each}
</div>
