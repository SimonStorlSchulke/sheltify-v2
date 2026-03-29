<script lang="ts">
  import Image from "./Image.svelte";
  import type { CmsAnimal } from "sheltify-lib/cms-types";

  let { animal, bubbles = [] }: { animal: CmsAnimal, bubbles?: {text: string, color: string}[] } = $props();

  function getBubbles() {
    const labels: {text: string, color: string}[] = [];

    if(animal.PatronsNeeded) labels.push({text: 'Paten gesucht!', color: 'var(--c-cto)'});
    if(animal.Where) labels.push({text: animal.Where, color: 'var(--c-primary)'});
    if(animal.Status == 'Vermittlungshilfe') labels.push({text: 'Vermittlungshilfe', color: 'var(--c-primary)'});

    return labels;
  }

</script>

<div class="themable animal-card sui fade-in" id={"animal-card-" + animal.ID}>
  <Image cssClass="portrait" img={animal.Portrait} size={"medium"} />

  <div class="sui flex-x center ai-center name-row">
    <span class="sui text-center p-1 px-2">{animal.Name}</span>
    <span class="gender-icon">{animal.Gender == "male" ? "♂" : "♀"}</span>
  </div>

  <div class="bubbles">
    {#each getBubbles() as bubble}
      <span style:background-color={bubble.color} class="emergency">{bubble.text}</span>
    {/each}

  </div>
</div>
