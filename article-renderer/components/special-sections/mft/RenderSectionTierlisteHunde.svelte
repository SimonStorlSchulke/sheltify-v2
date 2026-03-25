<svelte:options
  customElement={{
    tag: "section-special-mft-tierliste-hunde",
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

  // Local state
  let search = $state('');
  let size = $state('');
  let gender = $state('');
  let age = $state('');

  type FilterKey = 'size' | 'gender' | 'age';

  let filters = $state<Record<FilterKey, string>>({
    size: '',
    gender: '',
    age: '',
  })

  function toggleFilter(key: FilterKey, value: string) {
    filters[key] = filters[key] ? '' : value;
  }

  function toggleSize(value: string) {
    size = size === value ? '' : value;
  }

  function toggleGender(value: string) {
    gender = gender === value ? '' : value;
  }

  function toggleAge(value: string) {
    age = age === value ? '' : value;
  }

  function resetFilters() {
    size = '';
    gender = '';
    age = '';
  }

  let explainer = $derived.by(() => {
    const sizeTexts = new Map<string, string>([
      ["klein", "mit bis zu 30cm Schulterhöhe"],
      ["mittel", "mit 30-55cm Schulterhöhe"],
      ["groß", "ab 55cm Schulterhöhe"],
    ]);

    const ageTexts = new Map<string, string>([
      ["Welpen", "im Alter bis zu 12 Monaten"],
      ["Erwachsen", "im Alter von 1-6 Jahren"],
      ["Senioren", "ab 7 Jahren"],
    ]);

    const genderText = gender ? (gender === "male" ? "Rüden" : "Hündinnen") : "Hunde";
    const sizeText = sizeTexts.get(size) ?? "";
    const ageText = ageTexts.get(age) ?? "";

    const text = [genderText, sizeText, ageText].join(" ");
    if (text.trim() === "Hunde") return "";
    return text;
  });

  let anyFilterActive = $derived(!!size || !!gender || !!age);

  const filteredAnimals = $derived.by(() => {
    const bySearch = searchAnimal(search, 'Hund', allAnimals);
    if(!anyFilterActive) {
      return bySearch;
    }

    return bySearch.filter(animal => {
      let matchesSize = !size;
      let matchesGender = !gender;
      let matchesAge = !age;

      if(size && animal.ShoulderHeightCm) {
        if (size === 'klein' && animal.ShoulderHeightCm <= 40) matchesSize = true;
        else if (size === 'mittel' && animal.ShoulderHeightCm > 40 && animal.ShoulderHeightCm <= 55) matchesSize = true;
        else if (size === 'groß' && animal.ShoulderHeightCm > 55) matchesSize = true;
      }

      if(gender && animal.Gender) {
        if (gender === animal.Gender) matchesGender = true;
      }

      if(age && animal.Birthday.Valid) {
        let ageInYears = yearsOld(animal)!;
        if (age === 'Welpen' && ageInYears < 1) matchesAge = true;
        else if (age === 'Erwachsen' && ageInYears >= 1 && ageInYears < 7) matchesAge = true;
        else if (age === 'Senioren' && ageInYears >= 7) matchesAge = true;
      }

      return matchesSize && matchesGender && matchesAge;
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
    <button class:active={size === 'klein'} onclick={() => toggleSize('klein') }>klein</button>
    <button class:active={size === 'mittel'} onclick={() => toggleSize('mittel')}>mittel</button>
    <button class:active={size === 'groß'} onclick={() => toggleSize('groß')}>groß</button>
  </div>

  <div class="button-group">
    <button class:active={gender === 'female'} onclick={() => toggleGender('female')}>Hündinnen</button>
    <button class:active={gender === 'male'} onclick={() => toggleGender('male')}>Rüden</button>
  </div>

  <div class="button-group">
    <button class:active={age === 'Welpen'} onclick={() => toggleAge('Welpen')} >Welpen</button>
    <button class:active={age === 'Erwachsen'} onclick={() => toggleAge('Erwachsen')}>Erwachsen</button>
    <button class:active={age === 'Senioren'} onclick={() => toggleAge('Senioren')}>Senioren</button>
  </div>
</div>

<p class="sui text-center"><b>{explainer}</b></p>

<div class="sui flex-x gap-2 wrap">
  {#each filteredAnimals as animal}
    <a href={getAnimalLink(animal, allAnimalsByArticle)}>
      <AnimalCard animal="{animal}"/>
    </a>
  {/each}
</div>
</div>
