import { Component, effect, input, OnInit, output, resource, signal } from '@angular/core';
import { bootstrapGripVertical, bootstrapX, bootstrapPlus } from '@ng-icons/bootstrap-icons';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lastValueFrom } from 'rxjs';
import { CmsArticle, CmsArticleRow, CmsArticleSectionRef, SectionType } from 'src/app/cms-types/article-types';
import { PickNewSectionComponent } from 'src/app/editor/article-editor/pick-new-section/pick-new-section.component';
import { TextSectionEditorComponent } from 'src/app/editor/article-editor/text-section-editor/text-section-editor.component';
import { AlertService } from 'src/app/services/alert.service';
import { CmsRequestService } from 'src/app/services/cms-request.service';
import { ModalService } from 'src/app/services/modal.service';

const testArticle: CmsArticle = {
  Structure: {
    Rows: [
      { Sections: [] },
    ],
  },
  TenantID: "snhg"
}

@Component({
  selector: 'app-article-editor',
  imports: [TextSectionEditorComponent, NgIcon],
  providers: [provideIcons({bootstrapGripVertical, bootstrapX, bootstrapPlus})],
  templateUrl: './article-editor.component.html',
  styleUrl: './article-editor.component.scss'
})
export class ArticleEditorComponent {

  articleId = input.required<number>();

  articleIdSaved = output<number>();

  article = signal<CmsArticle>(testArticle);
  movedItem = signal<{row: number, column: number, sectionRef: CmsArticleSectionRef} | null>(null);

  constructor(private readonly modalService: ModalService, private readonly alertService: AlertService, private readonly cmsRequestService: CmsRequestService) {
    effect(async() => {
      console.log("a", this.articleId())
      if( !this.articleId() || this.articleId() == -1) return;
      const article = await lastValueFrom(this.cmsRequestService.getArticle(this.articleId()));

      const articlesAnimals = await lastValueFrom(this.cmsRequestService.getAnimalsByArticleId(this.articleId()))
      console.log(articlesAnimals)

      this.article.set(article);
    });
  }



  public enterMoveMode(row: number, column: number, sectionRef: CmsArticleSectionRef) {
    this.movedItem.set({row, column, sectionRef})
  }

  public async addSectionAt(row: number, column: number) {
    if(this.movedItem()) return;
    const sectionType = await this.modalService.openFinishable(PickNewSectionComponent);
    const sectionRef: CmsArticleSectionRef = this.createEmptySection(sectionType);
    const article = this.article();
    const newRow = article.Structure.Rows[row];
    newRow.Sections.splice(column, 0, sectionRef);
    this.exitMoveMode();
  }

  public async addSectionAtNewRow(row: number) {
    if(this.movedItem()) return;
    const article = this.article();

    const sectionType = await this.modalService.openFinishable(PickNewSectionComponent);
    const sectionRef: CmsArticleSectionRef = this.createEmptySection(sectionType);
    const newRow: CmsArticleRow = {
      Sections: [sectionRef]
    }

    article.Structure.Rows.splice(row, 0, newRow);
    this.cleanupEmptyRows(article);
    this.exitMoveMode();
  }


  public async save() {
    const savedArticle = await lastValueFrom(this.cmsRequestService.saveArticle(this.article()));
    this.articleIdSaved.emit(savedArticle!.ID!);
  }

  private createEmptySection(sectionType: SectionType): CmsArticleSectionRef {
    return {
      ArticleRowID: 1,
      SectionID: 1,
      SectionType: sectionType,
      ID: 2,
    }
  }

  public exitMoveMode(): void {
    setTimeout(() => {
      this.movedItem.set(null)
    }, 0);
  }

  public moveToNewRow(row: number): void {
    const movedItem = this.movedItem();
    if(!movedItem) return;
    const article = this.article();
    const newRow: CmsArticleRow = {
      Sections: [movedItem.sectionRef]
    }

    if(movedItem.row != -1) {
      article.Structure.Rows[movedItem.row].Sections.splice(movedItem.column, 1)
    }
    article.Structure.Rows.splice(row, 0, newRow);
    this.cleanupEmptyRows(article);
    this.exitMoveMode();
  }

  public moveToColumn(row: number, column: number): void {
    const movedItem = this.movedItem();
    if(!movedItem) return;
    const article = this.article();
    const newRow = article.Structure.Rows[row];

    if(movedItem.row != -1) {
      article.Structure.Rows[movedItem.row].Sections.splice(movedItem.column, 1);
    }


    newRow.Sections.splice(column, 0, movedItem.sectionRef);
    this.cleanupEmptyRows(article);
    this.exitMoveMode();
  }

  public async deleteSection(row: number, column: number): Promise<void> {
    const answer = await this.alertService.openAlert("Sektion wirklich entfernen?", "", ["nein", "ja"])
    if(answer == 'ja') {
      const article = this.article();
      article.Structure.Rows[row].Sections.splice(column, 1);
      this.cleanupEmptyRows(article);
    }
  }

  private cleanupEmptyRows(article: CmsArticle): void {
    article.Structure.Rows = article.Structure.Rows.filter((row: CmsArticleRow) => row.Sections.length > 0)
    this.article.set(article);
  }


}

