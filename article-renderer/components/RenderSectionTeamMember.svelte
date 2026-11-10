<svelte:options
  customElement={{
    tag: "section-team-member",
    shadow: "none",
  }}
/>

<script lang="ts">
  import Image from './shared/Image.svelte';
  import type { SectionTeamMember } from "sheltify-lib/article-types";
  let {section}: { section: SectionTeamMember } = $props();
</script>

<div class="teammember sui flex-y">
  <Image cssClass="portrait" img={section.Content.Portrait} size={"small"} />

  <h3 class="sui mb-1 mt-2">{section.Content.Name}</h3>
  <b>{section.Content.Role}</b>
  <span class="description">{section.Content.Description}</span>
  <span class="email">{section.Content.EMail}</span>
  <span class="phone">{section.Content.Phone}</span>
  <div class="sui grow-1"></div>

</div>
