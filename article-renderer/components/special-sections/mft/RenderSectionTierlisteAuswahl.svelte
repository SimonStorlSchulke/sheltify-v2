<svelte:options
  customElement={{
    tag: "section-special-mft-tierliste-auswahl",
    shadow: "none",
  }}
/>

<script lang="ts">
  import type { SectionSpecial } from 'sheltify-lib/dist/article-types';
  import type { CmsImage } from 'sheltify-lib/dist/cms-types';
  import { getPropValue } from '../special-section-utils';
  import { getImageSrc } from '../../../util';

  let {section}: { section: SectionSpecial } = $props();

  const Aktiv = getPropValue<string>(section, 'Aktiv');
  const imgHunde = getPropValue<CmsImage>(section, 'Bild Hunde');
  const imgKatzen = getPropValue<CmsImage>(section, 'Bild Katzen');
  const imgKleintiere = getPropValue<CmsImage>(section, 'Bild Kleintiere');
  const imgVermisst = getPropValue<CmsImage>(section, 'Bild Vermisst');
  const imgZuhauseGefunden = getPropValue<CmsImage>(section, 'Bild Zuhause gefunden');
  const imgFundtiere = getPropValue<CmsImage>(section, 'Bild Fundtiere');

</script>
<div class="placeholder"></div>
<div class="auswahl sui flex-x">
  <a class:active={Aktiv === 'Hunde'} href="/Tiere/Hunde">
    <img src={getImageSrc(imgHunde, 'medium')} alt=""/>
    <div class="overlay"><h3 class="sui bold px-2">Hunde</h3></div>
  </a>
  <a class:active={Aktiv === 'Katzen'} href="/Tiere/Katzen">
    <img src={getImageSrc(imgKatzen, 'medium')} alt=""/>
    <div class="overlay"><h3 class="sui bold px-2">Katzen</h3></div>
  </a>
  <a class:active={Aktiv === 'Kleintiere'} href="/Tiere/Kleintiere">
    <img src={getImageSrc(imgKleintiere, 'medium')} alt=""/>
    <div class="overlay"><h3 class="sui bold px-2">Kleintiere</h3></div>
  </a>
  <a class:active={Aktiv === 'Vermisst'} class="active" href="/Tiere/Vermisst">
    <img src={getImageSrc(imgVermisst, 'medium')} alt=""/>
    <div class="overlay"><h3 class="sui bold px-2">Vermisst</h3></div>
  </a>
  <a class:active={Aktiv === 'Zuhause-Gefunden'} href="/Tiere/Zuhause-Gefunden">
    <img src={getImageSrc(imgZuhauseGefunden, 'medium')} alt=""/>
    <div class="overlay"><h3 class="sui bold px-2">Zuhause gefunden</h3></div>
  </a>
  <a class:active={Aktiv === 'Fundtiere'} href="/Tiere/Fundtiere">
    <img src={getImageSrc(imgFundtiere, 'medium')} alt=""/>
    <div class="overlay"><h3 class="sui bold px-2">Fundtiere</h3></div>
  </a>
</div>
