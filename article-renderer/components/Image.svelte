<script lang="ts">
  import type { CmsImage, CmsImagesSize } from 'sheltify-lib/cms-types';
  import { getImageSrc } from '../util';

  interface Props {
    img: CmsImage | undefined,
    size: CmsImagesSize,
    cssClass?: string,
    cssStyle?: string,
    contain?: boolean,
  }
  let {img, size, cssClass, cssStyle, contain}: Props = $props();

  const style = img ?
    `object-fit: ${contain ? 'contain' : 'cover'}; object-position: ${(img.FocusX * 100).toFixed(2)}% ${(img.FocusY * 100).toFixed(2)}%;` + (cssStyle ? ` ${cssStyle}` : '')
    : ''

</script>

{#if img}
  <img style={style} class={cssClass} src={getImageSrc(img, size)} alt={img.Description || img.Title} />
{/if}