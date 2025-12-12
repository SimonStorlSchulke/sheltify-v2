import { expect, Page } from "@playwright/test";
import { CmsPage } from "./login";
import { ArticleEditor } from "./article-editor";
import { MediaLibrary } from "./media-library";

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

    get form() {
        return this.page.getByTestId('form-animal-editor');
    }

    getAnimalEntry(name: string) {
        return this.page.getByTestId('label-list-animal-' + name);
    }

    async toAnimal(name: string) {
        await this.getAnimalEntry(name).click();
        await expect(this.page.locator('#animal-name')).toHaveValue(name);
    }

    async newAnimal(name: string) {
        await this.page.getByTestId('btn-new-animal').click();
        await this.getDialog().locator('input').fill(name);
        await this.getDialog().getByTestId('btn-submit').click();
        await expect(this.getAnimalEntry(name).first()).toContainText(name);
    }

    async createArticleForCurrentAnimal() {
        await this.page.getByTestId('btn-create-article-for-animal').click();
    }

    async assignExistingArticleToCurrentAnimal(name: string) {
        await this.page.getByTestId('btn-assign-article-to-animal').click();
        await this.page.getByTestId('btn-select-animalarticle-' + name).click();
    }

    async deleteAnimal(name: string) {
        await this.getAnimalEntry(name).getByTestId('btn-delete-animal').click();
        await this.waitForToast('Löschen erfolgreich');
        await expect(this.getAnimalEntry(name)).not.toBeVisible();
    }
    
    async save() {
        await this.page.getByTestId('btn-save-animal').click();
        await this.waitForToast('Speichern erfolgreich');
    }

    async setPortrait(path: string) {
        const m = new MediaLibrary(this.page);
        await m.uploadImage(path);
        await m.selectByTitle(path.split('.')[0]);
        await m.submitSelection();
        await this.page.waitForTimeout(100);
    }
}