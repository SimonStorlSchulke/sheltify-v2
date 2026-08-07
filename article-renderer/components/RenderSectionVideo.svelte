<svelte:options
  customElement={{
    tag: "section-video",
    shadow: "none",
  }}
/>

<script lang="ts">
  import type { SectionVideo } from "sheltify-lib/article-types";

  let {section}: { section: SectionVideo } = $props();

  let videoId = $derived(() => {
    const [a, , b] = section.Content.Url.replace(/(>|<)/gi, '').split(/^.*(?:(?:youtu\.?be(\.com)?\/|v\/|vi\/|u\/\w\/|embed\/|shorts\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/)
    if (b !== undefined) {
      return b.split(/[^0-9a-z_-]/i)[0]
    } else {
      return a
    }
  })

  let isVertical = $derived(() => {
    return section.Content.Url.includes("shorts") || section.Content.Vertical;
  })

</script>

<div class="video-container sui flex-x jc-center">
  <iframe
    class="sui ignore-print"
    class:vertical={isVertical()}
    src={'https://www.youtube.com/embed/' + videoId()}
    title={section.Content.Title}
    frameborder="0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    referrerpolicy="strict-origin-when-cross-origin"
    allowfullscreen
  >
  </iframe>
</div>
