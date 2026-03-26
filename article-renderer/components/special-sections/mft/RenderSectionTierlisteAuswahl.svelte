<svelte:options
  customElement={{
    tag: "section-special-mft-tierliste-auswahl",
    shadow: "none",
  }}
/>

<script lang="ts">
  import Image from '../../Image.svelte';
  import type { SectionSpecial } from 'sheltify-lib/dist/article-types';
  import type { CmsImage } from 'sheltify-lib/dist/cms-types';
  import { getPropValue } from '../special-section-utils';

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
    <Image img={imgHunde} size={'medium'}/>
    <div class="overlay"><h3 class="sui bold px-2">Hunde</h3></div>
  </a>
  <a class:active={Aktiv === 'Katzen'} href="/Tiere/Katzen">
    <Image img={imgKatzen} size={'medium'}/>
    <div class="overlay"><h3 class="sui bold px-2">Katzen</h3></div>
  </a>
  <a class:active={Aktiv === 'Kleintiere'} href="/Tiere/Kleintiere">
    <Image img={imgKleintiere} size={'medium'}/>
    <div class="overlay"><h3 class="sui bold px-2">Kleintiere</h3></div>
  </a>
  <a class:active={Aktiv === 'Vermisst'} class="active" href="/Tiere/Vermisst">
    <Image img={imgVermisst} size={'medium'}/>
    <div class="overlay"><h3 class="sui bold px-2">Vermisst</h3></div>
  </a>
  <a class:active={Aktiv === 'Zuhause-Gefunden'} href="/Tiere/Zuhause-Gefunden">
    <Image img={imgZuhauseGefunden} size={'medium'}/>
    <div class="overlay"><h3 class="sui bold px-2">Zuhause gefunden</h3></div>
  </a>
  <a class:active={Aktiv === 'Fundtiere'} href="/Tiere/Fundtiere">
    <Image img={imgFundtiere} size={'medium'}/>
    <div class="overlay"><h3 class="sui bold px-2">Fundtiere</h3></div>
  </a>
</div>
