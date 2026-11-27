<script lang="ts">
  import type { CmsImage, CmsImagesSize } from 'sheltify-lib/dist/cms-types';
  import { getImageSrc } from '../../util';

  interface Props {
    img: CmsImage | undefined,
    size: CmsImagesSize,
    cssClass?: string,
    cssStyle?: string,
    contain?: boolean,
    /** lazy by default; pass 'eager' for images that are visible right away (e.g. the hero) */
    loading?: 'lazy' | 'eager',
    fetchpriority?: 'high' | 'low' | 'auto',
  }
  let {img, size, cssClass, cssStyle, contain, loading = 'lazy', fetchpriority}: Props = $props();

  const style = img ?
    `object-fit: ${contain ? 'contain' : 'cover'}; object-position: ${(img.FocusX * 100).toFixed(2)}% ${(img.FocusY * 100).toFixed(2)}%;` + (cssStyle ? ` ${cssStyle}` : '')
    : ''

</script>

{#if img}
  <img style={style} class={cssClass} {loading} {fetchpriority} src={getImageSrc(img, size)} alt={img.Description || img.Title} />
  {:else}
  <div>Bild nicht gefunden</div>
{/if}
