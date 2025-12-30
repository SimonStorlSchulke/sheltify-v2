import { CmsPage } from 'cms-types';
export type MenuEntry = {
    title: string;
    link?: string;
    children: MenuEntry[];
};
export declare function createPageStructure(pages: CmsPage[]): Map<string, MenuEntry>;
