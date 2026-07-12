<svelte:options
  customElement={{
    tag: "section-file",
    shadow: "none",
  }}
/>


<script lang="ts">
  import { config } from '../config';
  import { downloadFile } from '../util';
  import type { SectionFile } from "sheltify-lib/article-types";

  const iconsUrl = config.staticUrl + 'icons';
  let {section}: { section: SectionFile } = $props();


  function getFileIcon(fileName: string) {
    const extension = (fileName.split('.').pop() ?? '').toLowerCase();

    switch (extension) {
      case 'png':
      case 'jpg':
      case 'jpeg':
      case 'webp':
      case 'svg':
        return `${iconsUrl}/file-image.svg`;
      case 'exe':
      case 'msi':
        return `${iconsUrl}/file-executable.svg`;
      case 'pdf':
      case 'odt':
      case 'doc':
      case 'docx':
      case 'ppt':
      case 'pptx':
        return `${iconsUrl}/file-document.svg`;
      default:
        return `${iconsUrl}/file-other.svg`;
    }
  }

</script>

<div>
  {#if section.Content.File}
    {@const file = section.Content.File}
    <a on:click={() => downloadFile(file)}>
      <img src={getFileIcon(file.OriginalFileName)}>
      <span>herunterladen</span>
    </a>
    {:else}
    <div>Datei nicht gefunden</div>
  {/if}
</div>