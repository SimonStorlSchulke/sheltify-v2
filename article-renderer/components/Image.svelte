<script lang="ts">
  import type { CmsImage, CmsImagesSize } from 'sheltify-lib/dist/cms-types';
  import { getImageSrc } from '../util';

  interface Props {
    img: CmsImage | undefined,  // TODO: handle missing image
    size: CmsImagesSize,
    cssClass?: string,
    cssStyle?: string,
    contain?: boolean,
    refetch?: boolean,
  }
  const {img, size, cssClass, cssStyle, contain, refetch = true}: Props = $props();

  const style = `object-fit: ${contain ? 'contain' : 'cover'}; object-position: ${(img.FocusX * 100).toFixed(2)}% ${(img.FocusY * 100).toFixed(2)}%;` + (cssStyle ? ` ${cssStyle}` : '');

</script>

<img style={style} class={cssClass} src={getImageSrc(img, size)} alt={img.Description || img.Title} />
