export type SiteMapItem = {
  url: string;
  title: string;
  children: SiteMapItem[];
}

export type SiteMap = SiteMapItem[];