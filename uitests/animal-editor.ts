import { expect, Page } from "@playwright/test";
import { CmsPage } from "./login";
import { ArticleEditor } from "./article-editor";

export class AnimalEditor extends CmsPage {
    public articleEditor: ArticleEditor
    constructor(page: Page) {
        super(page);
        this.articleEditor = new ArticleEditor(page);
    }

    public async start() {
        await this.login();
        await this.goto('tiere');
    }

    getAnimalEntry(name: string) {
        return this.page.getByTestId('label-list-animal-' + name);
    }

    async newAnimal(name: string) {
        await this.page.getByTestId('btn-new-animal').click();
        await this.getDialog().locator('input').fill(name);
        await this.getDialog().getByTestId('btn-submit').click();
        await expect(this.getAnimalEntry(name).first()).toContainText(name);
    }


    async deleteAnimal(name: string) {
        await this.getAnimalEntry(name).getByTestId('btn-delete-animal').click();
    }
}