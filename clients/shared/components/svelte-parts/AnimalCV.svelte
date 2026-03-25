<script lang="ts">
  import { getImageSrc } from '@shared/cms/cms-image.ts';
  import type { CmsAnimal } from 'sheltify-lib/dist/cms-types.ts';

  let {animal}: { animal: CmsAnimal } = $props();

  function getAgeString(animal: CmsAnimal): string {
    if (!animal.Birthday?.Valid) return 'Unbekannt';
    const birthDate = new Date(animal.Birthday.Time!);
    const today = new Date();
    let months: number = monthDiff(birthDate, today);

    if (months < 12) {
      return `ca. ${months} Monate`;
    }

    const yearsRounded = Math.round((months / 12) * 2) / 2;
    const yearsString = yearsRounded.toString().replace('.5', ' 1/2');
    return yearsString == '1'
      ? `ca. ${yearsString} Jahr`
      : `ca. ${yearsString} Jahre`;
  }

  function monthDiff(d1: Date, d2: Date): number {
    let months;
    months = (d2.getFullYear() - d1.getFullYear()) * 12;
    months -= d1.getMonth();
    months += d2.getMonth();
    return months <= 0 ? 0 : months;
  }
</script>

<div class="sui wrapper themable article pt-4">
  <div class="sui flex-x ai-center">
    <div class="sui grow-1 flex-y">
      <h1 class="sui mb-3 flex-x ai-center gap-4"><a
        title="Zurück zur Übersicht" class="back-link" href="/Tiere/Hunde">&lt; </a>{animal.Name}<img
        class="gender-icon" alt="male" src="assets/img/male.svg"></h1>
    </div><a target="_blank" class="print" href="/print/tierartikel/Pumba"><img alt="print" src="assets/icons/printer.svg" class="sui inline-icon"></a>
  </div>
  <div class="cvs">
    <div class="tabs sui flex-x wrap"></div>
    <div class="tab-body sui p-4 flex-y gap-5">
      <div class="cv-grid">
        <div class="cv-attributes">
          <div class="sui flex-y gap-2">
            {#if animal.Birthday.Valid}<span><strong>Alter:</strong> {getAgeString(animal)}</span>{/if}
            {#if animal.Race}<span><strong>Rasse:</strong> {animal.Race}</span>{/if}
            {#if animal.Castrated.Valid}<span><strong>Kastriert:</strong> {animal.Castrated ? 'ja' : 'nein'}</span>{/if}
            {#if animal.WeightKg}<span><strong>Gewicht:</strong> ca. {animal.WeightKg}kg</span>{/if}
          </div>
        </div>
        <div class="cv-image-wrapper">
          {#if animal.Portrait}
            <img class="cv-img" alt="null" src={getImageSrc(animal.Portrait, 'medium')}>
          {/if}
          <div class="bubbles"></div>
        </div>
        <div class="cv-description">
          <span class="short-description">{animal.Description}</span>
        </div>
      </div>
      <div class="sui flex-x gap-3"><a href="/kontakt"><button
        class="primary">Jetzt bewerben</button></a></div>
    </div>
  </div><br>
</div>