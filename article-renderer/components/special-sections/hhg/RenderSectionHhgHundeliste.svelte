<svelte:options
  customElement={{
    tag: "section-special-hhg-hundeliste",
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

  type FilterKey = 'inGermany' | 'size' | 'gender' | 'age' | 'patenGesucht';

  let search = $state('');

  let filters = $state<Record<FilterKey, string>>({
    inGermany: '',
    size: '',
    gender: '',
    age: '',
    patenGesucht: '',
  })

  function toggleFilter(key: FilterKey, value: string) {
    if(filters[key] == value) {
      filters[key] = '';
      return;
    }
    console.log('c-val:', filters[key], 'nextVal:', value);
    filters[key] = filters[key] != value ? value : '';
  }

  let anyFilterActive = $derived(Object.values(filters).some(v => !!v));

  const filteredAnimals = $derived.by(() => {
    const bySearch = searchAnimal(search, 'Hund', allAnimals);
    if(!anyFilterActive) {
      return bySearch;
    }

    return bySearch.filter(animal => {
      let matchesInGermany = !filters.inGermany
      let matchesSize = !filters.size;
      let matchesGender = !filters.gender;
      let matchesAge = !filters.age;
      let matchesPatenGesucht = !filters.patenGesucht


      if(filters.inGermany && animal.Where) {
        matchesInGermany = true;
      }

      if(filters.size && animal.ShoulderHeightCm) {
        if (filters.size === 'klein' && animal.ShoulderHeightCm <= 40) matchesSize = true;
        else if (filters.size === 'mittel' && animal.ShoulderHeightCm > 40 && animal.ShoulderHeightCm <= 55) matchesSize = true;
        else if (filters.size === 'groß' && animal.ShoulderHeightCm > 55) matchesSize = true;
      }

      if(filters.gender && animal.Gender) {
        if (filters.gender === animal.Gender) matchesGender = true;
      }

      if(filters.age && animal.Birthday.Valid) {
        let ageInYears = yearsOld(animal)!;
        if (filters.age === 'Welpen' && ageInYears < 1) matchesAge = true;
        else if (filters.age === 'Erwachsen' && ageInYears >= 1 && ageInYears < 7) matchesAge = true;
        else if (filters.age === 'Senioren' && ageInYears >= 7) matchesAge = true;
      }

      if(filters.patenGesucht && animal.PatronsNeeded) {
        matchesPatenGesucht = true;
      }

      console.log(matchesSize)

      return matchesSize && matchesGender && matchesAge && matchesInGermany && matchesPatenGesucht;
    });
  });

  function resetFilters() {
    filters = {inGermany: '', size: '', gender: '', age: '', patenGesucht: '' };
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

    const genderText = filters.gender ? (filters.gender === "male" ? "Rüden" : "Hündinnen") : "Hunde";
    const inGermanyText = filters.inGermany;
    const sizeText = sizeTexts.get(filters.size) ?? "";
    const ageText = ageTexts.get(filters.age) ?? "";
    const patenGesuchtText = filters.patenGesucht ? ", die Paten suchen" : "";

    const text = [genderText, inGermanyText, sizeText, ageText, patenGesuchtText].join(" ");
    if (text.trim() === "Hunde") return "";
    return text;
  });

</script>

<div class="sui flex-y gap-3">
  <div class="sui flex-x wrap gap-2">
    <input
      type="text"
      placeholder="Search animals..."
      oninput={() => resetFilters()}
      bind:value={search}
    />

    <button class={filters.inGermany === 'in Deutschland' ? 'primary' : 'secondary'} onclick={() => toggleFilter('inGermany', 'in Deutschland') }>in Deutschland</button>

    <div class="button-group">
      <button class:active={filters.size === 'klein'} onclick={() => toggleFilter('size', 'klein') }>klein</button>
      <button class:active={filters.size === 'mittel'} onclick={() => toggleFilter('size', 'mittel')}>mittel</button>
      <button class:active={filters.size === 'groß'} onclick={() => toggleFilter('size', 'groß')}>groß</button>
    </div>

    <div class="button-group">
      <button class:active={filters.gender === 'female'} onclick={() => toggleFilter('gender', 'female')}>Hündinnen</button>
      <button class:active={filters.gender === 'male'} onclick={() => toggleFilter('gender', 'male')}>Rüden</button>
    </div>

    <div class="button-group">
      <button class:active={filters.age === 'Welpen'} onclick={() => toggleFilter('age', 'Welpen')}>Welpen</button>
      <button class:active={filters.age === 'Erwachsen'} onclick={() => toggleFilter('age', 'Erwachsen')}>Erwachsen</button>
      <button class:active={filters.age === 'Senioren'} onclick={() => toggleFilter('age', 'Senioren')}>Senioren</button>
    </div>

    <button class={filters.patenGesucht === 'Paten gesucht' ? 'primary' : 'secondary'} onclick={() => toggleFilter('patenGesucht', 'Paten gesucht') }>Paten gesucht</button>

  </div>

  <p class="sui text-center"><b>{explainer}</b></p>

  <div class="sui flex-x gap-4 wrap">
    {#each filteredAnimals as animal}
      <a href={getAnimalLink(animal, allAnimalsByArticle)}>
        <AnimalCard animal={animal}/>
      </a>
    {/each}
  </div>
</div>