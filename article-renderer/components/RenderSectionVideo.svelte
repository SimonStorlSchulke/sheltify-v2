<svelte:options
  customElement={{
    tag: "section-video",
    shadow: "none",
  }}
/>

<script lang="ts">
  import { onMount } from "svelte";
  import type { SectionVideo } from "sheltify-lib/article-types";

  let { section }: { section: SectionVideo } = $props();

  const STORAGE_KEY = "youtube-embed-consent";

  let hasConsent = $state(false);
  let initialized = $state(false);

  onMount(() => {
    // Dirty hack I guess but it works for now.
    hasConsent = localStorage.getItem(STORAGE_KEY) === "true"
      || location.origin.startsWith('https://editor.sheltify.com')
      || location.origin.startsWith('http://localhost:4201');
    initialized = true;
  });

  let videoId = $derived(() => {
    const [a, , b] = section.Content.Url.replace(/(>|<)/gi, '').split(/^.*(?:(?:youtu\.?be(\.com)?\/|v\/|vi\/|u\/\w\/|embed\/|shorts\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/)
    if (b !== undefined) {
      return b.split(/[^0-9a-z_-]/i)[0]
    } else {
      return a
    }
  });

  let isVertical = $derived(() => {
    return section.Content.Url.includes("shorts") || section.Content.Vertical;
  });

  function allowYoutube() {
    hasConsent = true;
    localStorage.setItem(STORAGE_KEY, "true");
  }
</script>

<div class="video-container sui flex-x jc-center grow-1">
  {#if initialized && hasConsent}
    <iframe
      class="sui ignore-print frame"
      class:vertical={isVertical()}
      src={"https://www.youtube-nocookie.com/embed/" + videoId()}
      title={section.Content.Title}
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      referrerpolicy="strict-origin-when-cross-origin"
      allowfullscreen
    ></iframe>
  {:else if initialized}
    <div class="youtube-consent sui flex-y ai-center jc-center p-2 gap-2" class:vertical={isVertical()}>
      <b>Externes Video</b>
      <p>Dieses Video wird auf YouTube bereitgestellt. Bitte geben Sie ihre Einverständnis.
        Mit der Bestätigung zu eingebetteten Videos erklären Sie sich damit einverstanden, dass Ihnen externe Inhalte von youtube.com innerhalb dieser Webseite angezeigt werden. Dadurch werden möglicherweise personenbezogene Daten z.B. Ihre IP Addresse an Drittplattformen übermittelt (z.B. an youtube.com). <!-- TODO!!! Weitere Informationen finden Sie in unserer Datenschutzerklärung.-->
      </p>

      <button type="button" onclick={() => allowYoutube()}>YouTube Video anzeigen</button>
    </div>
  {/if}
</div>
