import { Page } from "@playwright/test";
import { CmsPage } from "./login";
import path from "path";

export class MediaLibrary extends CmsPage {
    constructor(page: Page) {
        super(page);
    }

    get locator() {
        return this.page.locator('app-media-library');
    }

    async uploadImage(assetName: string) {
        this.locator.getByTestId('btn-upload-images').click();
        const fileChooserPromise = this.page.waitForEvent('filechooser');
        const fileChooser = await fileChooserPromise;
        await fileChooser.setFiles(path.join(__dirname, './assets/' + assetName));
    }

    async selectByTitle(title: string) {
        await this.locator.getByTestId('media-entry-' + title).click();
    }

    async submitSelection() {
        await this.locator.getByTestId('btn-submit').click();
    }
}