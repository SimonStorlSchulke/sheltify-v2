<script lang="ts">
  import type { CmsTeamMember } from "sheltify-lib/cms-types";

  let {member}: { member: CmsTeamMember } = $props();
</script>

<div class="teammember">
  <img
    class="avatar"
    alt="Ilona Dittes"
    src="https://cms.sheltify.de/uploads/Loni1_26e17e95e9.png"
  />
  <h3 class="sui mb-1 mt-2">{member.Name}</h3>
  <b>{member.Role}</b>
  <span>{member.Description}</span
  ><!---->
  <div class="sui grow-1"></div>
  <a
    href="mailto:tierheim@Menschen-fuer-Tiere-Spaichingen.de"
    ><button class="secondary">Mail schreiben</button
    ></a
  ><!---->
</div>
