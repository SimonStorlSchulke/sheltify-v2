export function createPageStructure(pages) {
    const menu = new Map();
    for (const page of pages) {
        const parts = page.Path.split('/');
        if (parts.length > 2) {
            console.log('sub-sub menus not supported');
            continue;
        }
        const isMainPage = parts.length == 1;
        const isSubMenu = parts.length == 2;
        const category = parts[0];
        const hasMenu = menu.has(category);
        if (!hasMenu) {
            menu.set(category, {
                title: category,
                children: [],
            });
        }
        if (isMainPage) {
            menu.get(category).link = page.Path;
        }
        if (isSubMenu) {
            menu.get(category).children.push({
                title: parts[1],
                link: page.Path,
                children: [],
            });
        }
    }
    return menu;
}
