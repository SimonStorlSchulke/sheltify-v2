import { Component, signal } from '@angular/core';
import { bootstrapGripVertical, bootstrapX, bootstrapPlus } from '@ng-icons/bootstrap-icons';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { CmsArticle, CmsArticleRow, CmsArticleSectionRef } from 'src/app/cms-types/article-types';
import { TextSectionEditorComponent } from 'src/app/editor/article-editor/text-section-editor/text-section-editor.component';
import { AlertService } from 'src/app/services/alert.service';
import { ModalService } from 'src/app/services/modal.service';

const testArticle: CmsArticle = {
  Rows: [
    {
      Position: 0,
      Sections: [
        {
          ArticleRowID: 0,
          SectionID: 0,
          SectionType: "section a",
          ID: 2,
        },
        {
          ArticleRowID: 0,
          SectionID: 0,
          SectionType: "section b",
          ID: 2,
        },
        {
          ArticleRowID: 0,
          SectionID: 0,
          SectionType: "section c",
          ID: 2,
        },
      ],
    },
    {
      Position: 0,
      Sections: [
        {
          ArticleRowID: 0,
          SectionID: 0,
          SectionType: "section d",
          ID: 2,
        },
        {
          ArticleRowID: 0,
          SectionID: 0,
          SectionType: "section e",
          ID: 2,
        },
      ],
    },
  ],
}

@Component({
  selector: 'app-article-editor',
  imports: [TextSectionEditorComponent, NgIcon],
  providers: [provideIcons({bootstrapGripVertical, bootstrapX, bootstrapPlus})],
  templateUrl: './article-editor.component.html',
  styleUrl: './article-editor.component.scss'
})
export class ArticleEditorComponent {
  article = signal<CmsArticle>(testArticle);
  movedItem = signal<{row: number, column: number, sectionRef: CmsArticleSectionRef} | null>(null);

  constructor(private readonly modalService: ModalService, private readonly alertService: AlertService) {
  }

  public enterMoveMode(row: number, column: number, sectionRef: CmsArticleSectionRef) {
    this.movedItem.set({row, column, sectionRef})
  }

  public exitMoveMode(): void {
    this.movedItem.set(null)
  }

  public moveToNewRow(row: number): void {
    const movedItem = this.movedItem()!;
    const article = this.article();
    const newRow: CmsArticleRow = {
      Sections: [movedItem.sectionRef]
    }
    article.Rows[movedItem.row].Sections.splice(movedItem.column, 1)
    article.Rows.splice(row, 0, newRow);
    this.cleanupEmptyRows(article);
    this.exitMoveMode();
  }

  public moveToColumn(row: number, column: number): void {
    const movedItem = this.movedItem()!;
    const article = this.article();
    const newRow = article.Rows[row];

    article.Rows[movedItem.row].Sections.splice(movedItem.column, 1);

    newRow.Sections.splice(column, 0, movedItem.sectionRef);
    this.cleanupEmptyRows(article);
    this.exitMoveMode();
  }

  public async deleteSection(row: number, column: number): Promise<void> {
    const answer = await this.alertService.openAlert("Sektion wirklich entfernen?", "", ["nein", "ja"])
    if(answer == 'ja') {
      const article = this.article();
      article.Rows[row].Sections.splice(column, 1);
      this.cleanupEmptyRows(article);
    }
  }

  private cleanupEmptyRows(article: CmsArticle): void {
    article.Rows = article.Rows.filter((row: CmsArticleRow) => row.Sections.length > 0)
    this.article.set(article);
  }

}

