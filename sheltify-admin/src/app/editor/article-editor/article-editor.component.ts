import { Component, effect, input, output, signal } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { bootstrapGripVertical, bootstrapX, bootstrapPlus } from '@ng-icons/bootstrap-icons';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lastValueFrom } from 'rxjs';
import { CmsArticle, CmsArticleRow, Section, SectionType } from 'src/app/cms-types/article-types';
import { createEmptySection } from 'src/app/editor/article-editor/article-section.factory';
import { PickNewSectionComponent } from 'src/app/editor/article-editor/pick-new-section/pick-new-section.component';
import { SectionEditorAnimalListComponent } from 'src/app/editor/article-editor/section-editor-animal-list/section-editor-animal-list.component';
import { SectionEditorImagesComponent } from 'src/app/editor/article-editor/section-editor-images/section-editor-images.component';
import { SectionEditorTitleComponent } from 'src/app/editor/article-editor/section-editor-title/section-editor-title.component';
import { SectionEditorTextComponent } from 'src/app/editor/article-editor/text-section-editor/section-editor-text.component';
import { AlertService } from 'src/app/services/alert.service';
import { renderArticleSection } from 'src/app/services/article-renderer';
import { CmsRequestService } from 'src/app/services/cms-request.service';
import { ModalService } from 'src/app/services/modal.service';

const emptyArticle: CmsArticle = {
  Structure: {
    Rows: [
      { Sections: [] },
    ],
  },
  TenantID: "snhg"
}

@Component({
  selector: 'app-article-editor',
  imports: [SectionEditorTextComponent, NgIcon, SectionEditorImagesComponent, SectionEditorTitleComponent, SectionEditorAnimalListComponent],
  providers: [provideIcons({bootstrapGripVertical, bootstrapX, bootstrapPlus})],
  templateUrl: './article-editor.component.html',
  styleUrl: './article-editor.component.scss'
})
export class ArticleEditorComponent {

  articleId = input.required<number>();

  articleIdSaved = output<number>();

  article = signal<CmsArticle | undefined>(emptyArticle);
  movedItem = signal<{row: number, column: number, sectionRef: Section} | null>(null);

  sectionLabels = new Map<SectionType, string>([
    ['title', 'Titel'],
    ['text', 'Text'],
    ['image', 'Bilder'],
    ['video', 'Video'],
    ['animal-list', 'Tierliste (statisch)'],
  ])

  constructor(
    private modalService: ModalService,
    private alertService: AlertService,
    private cmsRequestService: CmsRequestService,
    private domSanitizer: DomSanitizer,
    ) {
    effect(async() => {
      if( !this.articleId() || this.articleId() == -1) {
        this.article.set(emptyArticle);
        return;
      }
      this.article.set({Structure: {Rows: []}, TenantID: ''});
      const article = await lastValueFrom(this.cmsRequestService.getArticle(this.articleId()));

      const articlesAnimals = await lastValueFrom(this.cmsRequestService.getAnimalsByArticleId(this.articleId()))
      console.log(articlesAnimals)

      this.article.set(article);
    });
  }

  public enterMoveMode(row: number, column: number, sectionRef: Section) {
    this.movedItem.set({row, column, sectionRef})
  }

  public async addSectionAt(row: number, column: number) {
    if(!this.article()) return;
    if(this.movedItem()) return;
    const sectionType = await this.modalService.openFinishable(PickNewSectionComponent);
    const sectionRef: Section = createEmptySection(sectionType);
    const article = this.article()!;
    const newRow = article.Structure.Rows[row];
    newRow.Sections.splice(column, 0, sectionRef);
    this.exitMoveMode();
  }

  public async addSectionAtNewRow(row: number) {
    if(!this.article()) return;
    if(this.movedItem()) return;
    const article = this.article()!;

    const sectionType = await this.modalService.openFinishable(PickNewSectionComponent);
    const sectionRef = createEmptySection(sectionType);
    const newRow: CmsArticleRow = {
      Sections: [sectionRef]
    }

    article.Structure.Rows.splice(row, 0, newRow);
    this.cleanupEmptyRows(article);
    this.exitMoveMode();
  }


  public async save() {
    if(!this.article()) return;
    console.log("saving article", this.article())
    const savedArticle = await lastValueFrom(this.cmsRequestService.saveArticle(this.article()!));
    this.articleIdSaved.emit(savedArticle!.ID!);
  }

  public exitMoveMode() {
    setTimeout(() => {
      this.movedItem.set(null)
    }, 0);
  }

  public moveToNewRow(row: number) {
    if(!this.article()) return;
    const movedItem = this.movedItem();
    if(!movedItem) return;
    const article = this.article()!;
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

  public moveToColumn(row: number, column: number) {
    if(!this.article()) return;
    const movedItem = this.movedItem();
    if(!movedItem) return;
    const article = this.article()!;
    const newRow = article.Structure.Rows[row];

    if(movedItem.row != -1) {
      article.Structure.Rows[movedItem.row].Sections.splice(movedItem.column, 1);
    }

    newRow.Sections.splice(column, 0, movedItem.sectionRef);
    this.cleanupEmptyRows(article);
    this.exitMoveMode();
  }

  public async deleteSection(row: number, column: number): Promise<void> {
    if(!this.article()) return;
    const answer = await this.alertService.openAlert("Sektion wirklich entfernen?", "", ["nein", "ja"])
    if(answer == 'ja') {
      const article = this.article()!;
      article.Structure.Rows[row].Sections.splice(column, 1);
      this.cleanupEmptyRows(article);
    }
  }

  private cleanupEmptyRows(article: CmsArticle) {
    article.Structure.Rows = article.Structure.Rows.filter((row: CmsArticleRow) => row.Sections.length > 0)
    this.article.set(article);
  }

  public renderSection(section: Section): SafeHtml {
    return this.domSanitizer.bypassSecurityTrustHtml(renderArticleSection(section))
  }


  protected editSection(articleColumn: HTMLDivElement) {
    document.querySelectorAll('.article-column').forEach(el => el.classList.remove('edit-mode'));
    articleColumn.classList.add('edit-mode');
  }
}

