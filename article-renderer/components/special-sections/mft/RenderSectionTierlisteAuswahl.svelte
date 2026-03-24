<svelte:options
  customElement={{
    tag: "section-special-mft-animals-chooser",
    shadow: "none",
  }}
/>

<script lang="ts">
  import type { SectionSpecial } from 'sheltify-lib/dist/article-types';
  import type { CmsImage } from 'sheltify-lib/dist/cms-types';
  import { getPropValue } from '../special-section-utils';
  import { getImageSrc } from '../../../util';

  let {section}: { section: SectionSpecial } = $props();

  const imgHunde = getPropValue<CmsImage>(section, 'Bild Hunde');
  const imgKatzen = getPropValue<CmsImage>(section, 'Bild Katzen');
  const imgKleintiere = getPropValue<CmsImage>(section, 'Bild Kleintiere');
  const imgVermisst = getPropValue<CmsImage>(section, 'Bild Vermisst');
  const imgZuhauseGefunden = getPropValue<CmsImage>(section, 'Bild Zuhause gefunden');
  const imgFundtiere = getPropValue<CmsImage>(section, 'Bild Fundtiere');

</script>

<div class="auswahl sui flex-x">
  <a href="/Tiere/Hunde">
    <img class="sui--image" src={getImageSrc(imgHunde, 'medium')} alt=""/>
    <div class="overlay"><h3 class="sui bold px-2">Hunde</h3></div>
  </a>
  <a href="/Tiere/Katzen">
    <img class="sui--image" src={getImageSrc(imgKatzen, 'medium')} alt=""/>
    <div class="overlay"><h3 class="sui bold px-2">Katzen</h3></div>
  </a>
  <a href="/Tiere/Kleintiere">
    <img class="sui--image" src={getImageSrc(imgKleintiere, 'medium')} alt=""/>
    <div class="overlay"><h3 class="sui bold px-2">Kleintiere</h3></div>
  </a>
  <a class="active" href="/Tiere/Vermisst">
    <img class="sui--image" src={getImageSrc(imgVermisst, 'medium')} alt=""/>
    <div class="overlay"><h3 class="sui bold px-2">Vermisst</h3></div>
  </a>
  <a href="/Tiere/Zuhause-Gefunden">
    <img class="sui--image" src={getImageSrc(imgZuhauseGefunden, 'medium')} alt=""/>
    <div class="overlay"><h3 class="sui bold px-2">Zuhause gefunden</h3></div>
  </a>
  <a href="/Tiere/Fundtiere">
    <img class="sui--image" src={getImageSrc(imgFundtiere, 'medium')} alt=""/>
    <div class="overlay"><h3 class="sui bold px-2">Fundtiere</h3></div>
  </a>
</div>