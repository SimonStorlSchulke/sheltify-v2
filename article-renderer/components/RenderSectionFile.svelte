<svelte:options
  customElement={{
    tag: "section-file",
    shadow: "none",
  }}
/>


<script lang="ts">
  import { config } from '../config';
  import { downloadFile, getDownloadTitle } from '../util';
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

{#if section.Content.File}
  {@const file = section.Content.File}
  <a title="herunterladen" class="file sui flex-y ai-start gap-2" on:click={() => downloadFile(file)}>
    <div class="sui flex-x gap-2">
      <img src={getFileIcon(file.OriginalFileName)}>
      <div class="sui flex-y gap-2 ai-start">
        <div class="sui flex-y ai-start">
          <b>{file.Title}</b>
          <span>{file.Description}aa</span>
          <span>{section.Content.Text}aa</span>
          <i>{getDownloadTitle(file)}</i>
        </div>
      </div>
    </div>
    <button class="primary sm">Herunterladen</button>
  </a>
{:else}
  <div>Datei nicht gefunden</div>
{/if}
