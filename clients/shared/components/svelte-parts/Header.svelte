<script lang="ts">
  import { getImageSrc } from '@shared/cms/cms-image.ts';
  import HeaderEntry from '@shared/components/svelte-parts/HeaderEntry.svelte';
  import Image from 'article-renderer/components/shared/Image.svelte';
  import type { CmsImage, CmsPage } from 'sheltify-lib/dist/cms-types.ts';
  import { createPageStructure } from '../../../../sheltify-lib/dist/page-structure.ts';


  let {pages, logo}: {pages: CmsPage[], logo: CmsImage | undefined} = $props()

  let menu = $derived([...createPageStructure(pages).values()])
  let startPage = $derived(menu.find((item) => item.link == "/"));
  let burgerMenuOpen = $state(false);

</script>

<nav class="themable header desktop">
  <div class="logo">
    <a href={startPage && "/"}>
      {#if logo}
        <Image img={logo} size="medium" />
      {/if}
    </a>
  </div>
  <div class="menu">
    {#each menu as item}
      <HeaderEntry entry={item} startPageName="Home" />
    {/each}
  </div>
  <!--SearchBar -->
</nav>

<nav class="themable header mobile">
  <div class="sui flex-x mobile-topbar ai-center">
    <button onclick={() => burgerMenuOpen = !burgerMenuOpen} class="burger"><img src="/burger.png" alt="burger"></button>
    <div class="logo">
      <a href={startPage && "/"}>
        {#if logo}
          <img src={getImageSrc(logo, 'medium')} alt="logo"/>
        {/if}
      </a>
    </div>
  </div>

  <div class="menu">
    {#each menu as item}
      <HeaderEntry entry={item} startPageName="Home" />
    {/each}
  </div>
</nav>