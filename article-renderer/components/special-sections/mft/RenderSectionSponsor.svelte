<svelte:options
  customElement={{
    tag: "section-special-mft-sponsor",
    shadow: "none",
  }}
/>

<script lang="ts">
  import { getImageSrc } from '../../../util';
  import { getPropValue } from '../special-section-utils';
  import type { SectionSpecial } from "sheltify-lib/article-types";
  import type { CmsImage } from 'sheltify-lib/cms-types.ts';

  let { section }: { section: SectionSpecial } = $props();

  const name = getPropValue<string>(section, 'Name');
  const description = getPropValue<string>(section, 'Beschreibung');
  const logo = getPropValue<CmsImage>(section, 'Logo');

</script>

<div class="sponsor sui flex-x">
  <img src={getImageSrc(logo, 'medium')} alt={name} class="logo" />
  <div class="sui px-2 py-1">
    <b>{name}</b>
    <br>
    <span>{description}</span>
  </div>
</div>
