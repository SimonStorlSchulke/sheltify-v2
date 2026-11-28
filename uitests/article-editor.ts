import { expect, Page } from "@playwright/test";
import { CmsPage } from "./login";

export const SectionTypes = ["title", "text", "video", "image", "animal-list", "html", "separator-x"] as const;

export type SectionType = (typeof SectionTypes)[number];

export class ArticleEditor extends CmsPage {
    constructor(page: Page) {
        super(page)
    }

    async addRow(rowNumber: number, type: SectionType) {
        await this.page.getByTestId('row-selector-' + rowNumber).click();
        await this.page.getByTestId('btn-add-section-' + type).click();
    }

    /** The section editor dialog - opens after adding a section or clicking its preview. */
    getSectionEditor() {
        return this.page.locator('app-section-editor-panel');
    }

    async finishSectionEditing() {
        await this.getSectionEditor().getByTestId('btn-section-done').click();
    }

    getSectionPreview(row: number) {
        return this.page.getByTestId(`section-preview-${row}`);
    }

    async save() {
        await this.page.getByTestId('btn-save-article').click();
    }

    expectTextInPreview(row: number, text: string) {
        return expect(this.getSectionPreview(row)).toContainText(text);
    }
}