<script lang="ts">
  import SvgIcon from 'article-renderer/components/shared/SvgIcon.svelte';
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
  <h1 class="cv-title sui flex-x ai-center gap-2">
    <!-- svelte-ignore a11y_invalid_attribute -->
    <a class="back-link" href="javascript:history.back()" aria-label="Zurück">‹</a>
    <span>{animal.Name}</span>
  </h1>

  <div class="cv">
    <div class="cv-tab">
      <span>Steckbrief</span>
      {#if animal.Gender}
        <SvgIcon type={animal.Gender} size="medium-large" color="#fff"/>
      {/if}
    </div>
    <div class="cv-body">
      <div class="cv-grid">
        <div class="cv-attributes">
          {#if animal.Birthday?.Valid}<div><strong>Alter:</strong> {getAgeString(animal)}</div>{/if}
          {#if animal.Race}<div><strong>Rasse:</strong> {animal.Race}</div>{/if}
          {#if animal.Castrated?.Valid}<div><strong>Kastriert:</strong> {animal.Castrated.Bool ? 'ja' : 'nein'}</div>{/if}
          {#if animal.ShoulderHeightCm}<div><strong>Schulterhöhe:</strong> ca. {animal.ShoulderHeightCm}cm</div>{/if}
          {#if animal.WeightKg}<div><strong>Gewicht:</strong> ca. {animal.WeightKg}kg</div>{/if}
          {#if animal.Health}<div><strong>Gesundheit:</strong> {animal.Health}</div>{/if}
        </div>
        <div class="cv-description">{animal.Description}</div>
        {#if animal.Portrait}
          <img class="cv-img" alt={animal.Name} src={getImageSrc(animal.Portrait, 'medium')}>
        {/if}
      </div>
      <div class="cv-actions sui flex-x wrap gap-2">
        <a href="/kontakt"><button class="primary">Jetzt bewerben</button></a>
        {#if animal.PatronsNeeded}
          <a href="/kontakt"><button class="primary">Pate werden</button></a>
        {/if}
      </div>
    </div>
  </div>
</div>

<style>
  .cv-title {
    margin-bottom: 1.5rem;
  }

  .back-link {
    color: var(--themable-bg-accent-3, #ff8a80);
    text-decoration: none;
    font-size: 0.9em;
    line-height: 1;
  }

  .cv {
    margin: 0 2rem 2rem;
  }

  .cv-tab {
    display: inline-flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem 1.5rem;
    background: var(--themable-bg-accent-3, #ff8a80);
    color: #fff;
    font-weight: bold;
    font-size: 1.5rem;
    border-radius: 12px 12px 0 0;
    box-shadow: 0 0 12px #0000001f;
  }

  .cv-body {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    padding: 1.5rem;
    background: color-mix(in srgb, var(--themable-bg-accent-2, #ffdbb3) 60%, #fff);
    border-radius: 0 12px 12px 12px;
    box-shadow: 0 0 12px #0000001f;
  }

  .cv-grid {
    display: grid;
    grid-template-columns: 1fr 1fr 300px;
    gap: 2rem;
    align-items: start;
  }

  .cv-attributes {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .cv-attributes,
  .cv-description {
    line-height: 1.6;
  }

  .cv-img {
    width: 100%;
    aspect-ratio: 1;
    object-fit: cover;
    border-radius: 12px;
  }

  @media (max-width: 900px) {
    .cv {
      margin: 0 0 2rem;
    }

    .cv-grid {
      grid-template-columns: 1fr;
    }

    .cv-img {
      grid-row: 1;
      max-width: 400px;
    }
  }
</style>
