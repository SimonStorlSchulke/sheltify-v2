<script lang="ts">
  import { getImageSrc } from '@shared/cms/cms-image.ts';
  import type { CmsImage } from 'sheltify-lib/cms-types';

  let {images, layout, size}: { images: CmsImage[], layout: 'vertical' | 'horizontal' | 'gallery', size: 'small' | 'medium' | 'large' } = $props();

  let shownId: number | undefined = $state();

  let description = $derived(() => {
    const counter = `${(shownId ?? 0) + 1} / ${images.length}`;
    if (shownId === undefined || images[shownId].Description === '') return counter;
    const description = images[shownId].Description;
    if (description.length <= 150) return `${counter}<br>${description}`;
    return `${counter}<br>${images[shownId].Description.substring(0, 150)}...`;
  })

  function openLightBox(id: number) {
    shownId = id;
  }

  function closeLightBox() {
    shownId = undefined;
  }

  function onKeyDown(e: KeyboardEvent) {
    if (shownId === undefined) return;
    if (e.key == 'a' || e.key === 'ArrowLeft') previous();
    if (e.key == 'd' || e.key === 'ArrowRight') next();
    if (e.key === 'Escape') closeLightBox();
  }

  function next(e?: MouseEvent) {
    e?.stopPropagation();
    if (shownId! >= images.length - 1) {
      shownId = 0;
      return;
    }
    shownId! += 1;
  }

  function previous(e?: MouseEvent) {
    e?.stopPropagation();
    if (shownId! <= 0) {
      shownId = images.length - 1;
      return;
    }
    shownId! -= 1;
  }

</script>


<div class={`themable image-grid count-${images.length} ${layout} ${size}`}>
  {#each images as image, index}
    <img on:click={() => openLightBox(index)} src={getImageSrc(image, 'xlarge')} alt={image.Description || image.Title}>
  {/each}
</div>

{#if shownId !== undefined}
  <div on:click={closeLightBox} class="themable lightbox">
    <div class="lightbox-content">
      <button class="previous" on:click={(e) => previous(e)}><span>‹</span></button>
      <div class="sui flex-y ai-center jc-space-evenly gap-3 w-100">
        <img src={getImageSrc(images[shownId], 'xlarge')} alt={images[shownId].Description || images[shownId].Title}>
        <span class="description sui text-center py-1">{@html description()}</span>
      </div>
      <button class="next" on:click={(e) => next(e)}><span>›</span></button>
    </div>
  </div>
{/if}

<svelte:window on:keydown={onKeyDown}/>

<style lang="scss">
  .image-grid {
    &.vertical {
      column-count: 3;
      column-gap: 8px;

      &.count-1 {
        column-count: 1;
        max-width: 500px;
      }

      &.count-2 {
        column-count: 2;
        max-width: 800px;
      }
    }

    &.horizontal {
      display: flex;
      flex-wrap: wrap;
      column-gap: 8px;

      img {
        width: unset;
      }

      &.small {
        img {
          height: 150px;
        }
      }

      &.medium {
        img {
          height: 400px;
        }
      }

      &.large {
        img {
          width: 100%;
        }
      }
    }


  }


  .image-grid img {
    width: 100%;
    height: auto;
    display: block;
    margin-bottom: 8px;
    break-inside: avoid;
    object-fit: contain;

  }

  @media (max-width: 800px) {
    .image-grid.vertical {
      column-count: 2 !important;
    }
  }

  @media (max-width: 500px) {
    .image-grid.vertical {
      column-count: 1 !important;
    }
  }

  .lightbox {
    display: flex;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.85);
    z-index: 100;
    align-items: center;
    justify-content: center;

    .lightbox-content {
      display: flex;
      justify-content: space-between;
      align-items: stretch;
      width: 100%;
      height: 100%;
      padding-top: 32px;

      img {
        object-fit: contain;
        max-width: min(100%, 85dvw);
        flex-grow: 1;
        max-height: calc(100% - 80px);
      }
    }

    .description {
      color: rgba(255, 255, 255, 0.61);
    }

    button {
      background: none;
      width: clamp(150px, 125px, 15dvw);
      color: #fff;
      font-weight: bold;
      font-size: 32px;
      border-radius: 0;
      cursor: pointer;
      height: 100%;
      position: fixed;
      top: 0;

      &.previous {
        left: 0;

        &:hover {
          background: linear-gradient(-90deg, transparent, rgba(255, 255, 255, .3333333333))
        }
      }

      &.next {
        right: 0;

        &:hover {
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, .3333333333))
        }
      }
    }
  }
</style>