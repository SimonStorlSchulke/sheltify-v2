<svelte:options
  customElement={{
    tag: "section-special-mft-tierliste-katzen",
    shadow: "none",
  }}
/>

<script lang="ts">
  import { searchAnimal } from '../special-section-utils';
  import AnimalCard from '../../AnimalCard.svelte';
  import type { SectionSpecial } from 'sheltify-lib/dist/article-types';
  import type { CmsAnimal } from 'sheltify-lib/dist/cms-types';
  import { getAnimalLink, yearsOld } from '../../../util';

  let {section}: { section: SectionSpecial } = $props();

  const { allAnimals, allAnimalsByArticle } = section.TempData as {allAnimals: CmsAnimal[], allAnimalsByArticle: Record<string, CmsAnimal[]>};

  type FilterKey = 'freigaenger' | 'gender' | 'age';

  let search = $state('');

  let filters = $state<Record<FilterKey, string>>({
    freigaenger: '',
    gender: '',
    age: '',
  })

  function toggleFilter(key: FilterKey, value: string) {
    filters[key] = filters[key] ? '' : value;
  }

  function resetFilters() {
    filters = {freigaenger: '', gender: '', age: '' };
  }

  let explainer = $derived.by(() => {

    const ageTexts = new Map<string, string>([
      ["Kätzchen", "im Alter bis zu 12 Monaten"],
      ["Erwachsen", "im Alter von 1-11 Jahren"],
      ["Senioren", "ab 11 Jahren"],
    ]);

    const freigaengerText = filters.freigaenger == 'ja' ? "Freigänger" : "";
    const genderText = filters.gender ? (filters.gender === "male" ? "Kater" : "Kätzinnen") : "Katzen";
    const ageText = ageTexts.get(filters.age) ?? "";

    const text = [genderText, freigaengerText, ageText].join(" ");
    if (text.trim() === "Katzen") return "";
    return text;
  });

  let anyFilterActive = $derived(Object.values(filters).some(v => !!v));

  const filteredAnimals = $derived.by(() => {
    const bySearch = searchAnimal(search, 'Katze', allAnimals);
    if(!anyFilterActive) {
      return bySearch;
    }

    return bySearch.filter(animal => {
      let matchesGender = !filters.gender;
      let matchesAge = !filters.age;
      let matchesFreigaenger = !filters.freigaenger;

      if(filters.freigaenger && animal.FreeRoamer.Valid) {
        matchesFreigaenger = (filters.freigaenger == 'ja') && animal.FreeRoamer.Bool;
      }

      if(filters.gender && animal.Gender) {
        if (filters.gender === animal.Gender) matchesGender = true;
      }

      if(filters.age && animal.Birthday.Valid) {
        let ageInYears = yearsOld(animal)!;
        if (filters.age === 'Kätzchen' && ageInYears < 1) matchesAge = true;
        else if (filters.age === 'Erwachsen' && ageInYears >= 1 && ageInYears < 11) matchesAge = true;
        else if (filters.age === 'Senioren' && ageInYears >= 11) matchesAge = true;
      }

      return matchesFreigaenger && matchesGender && matchesAge;
    });
  });

</script>

<div class="sui flex-y gap-3">
  <div class="sui flex-x wrap gap-4">
    <input
      type="text"
      placeholder="Search animals..."
      oninput={() => resetFilters()}
      bind:value={search}
    />

    <div class="button-group">
      <button class:active={filters.freigaenger === 'nein'} onclick={() => toggleFilter('freigaenger', 'nein') }>Kein Freigänger</button>
      <button class:active={filters.freigaenger === 'ja'} onclick={() => toggleFilter('freigaenger', 'ja') }>Freigänger</button>
    </div>

    <div class="button-group">
      <button class:active={filters.gender === 'female'} onclick={() => toggleFilter('gender', 'female')}>Kätzinnen</button>
      <button class:active={filters.gender === 'male'} onclick={() => toggleFilter('gender', 'male')}>Kater</button>
    </div>

    <div class="button-group">
      <button class:active={filters.age === 'Kätzchen'} onclick={() => toggleFilter('age', 'Kätzchen')} >Kätzchen</button>
      <button class:active={filters.age === 'Erwachsen'} onclick={() => toggleFilter('age', 'Erwachsen')}>Erwachsen</button>
      <button class:active={filters.age === 'Senioren'} onclick={() => toggleFilter('age', 'Senioren')}>Senioren</button>
    </div>
  </div>

  <p class="sui text-center"><b>{explainer}</b></p>

  <div class="sui flex-x gap-4 wrap">
    {#each filteredAnimals as animal}
      <a href={getAnimalLink(animal, allAnimalsByArticle)}>
        <AnimalCard animal="{animal}"/>
      </a>
    {/each}
  </div>
</div>
