import { Page } from "@playwright/test";
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

    getSectionEditor(row: number, column: number) {
        return this.page.getByTestId(`section-editor-${row}-${column}`);
    }

    getSectionPreview(row: number, column: number) {
        return this.page.getByTestId(`section-preview-${row}-${column}`);
    }

    async save() {
        await this.page.getByTestId('btn-save-article').click();
    }
}