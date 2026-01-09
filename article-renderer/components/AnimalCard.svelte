<script lang="ts">
  import Image from "./Image.svelte";
  import type { CmsAnimal } from "sheltify-lib/cms-types";

  let {animal}: { animal: CmsAnimal } = $props();
</script>

<div class="themable animal-card shadow fade-in" id={'animal-card-' + animal.ID}>
  <Image cssClass="portrait" img={animal.Portrait} size={'medium'}/>

  <div class="sui flex-x center ai-center name-row">
    <span class="sui text-center p-1 px-2">{animal.Name}</span>
    <span class="gender-icon">{animal.Gender == 'male' ? '♂' : '♀'}</span>
  </div>
</div>