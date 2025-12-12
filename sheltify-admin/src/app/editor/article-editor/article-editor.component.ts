import { AsyncPipe } from '@angular/common';
import { Component, computed, DestroyRef, effect, HostListener, input, OnInit, Renderer2, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { bootstrapGripVertical, bootstrapX, bootstrapPlus } from '@ng-icons/bootstrap-icons';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lastValueFrom, Observable, Subject } from 'rxjs';
import { CmsArticle, CmsArticleRow, Section } from 'src/app/cms-types/article-types';
import { createEmptyArticle } from 'src/app/cms-types/cms-type.factory';
import { createEmptySection } from 'src/app/editor/article-editor/article-section.factory';
import { PickNewSectionComponent } from 'src/app/editor/article-editor/pick-new-section/pick-new-section.component';
import { SectionEditorAnimalListComponent } from 'src/app/editor/article-editor/section-editor-animal-list/section-editor-animal-list.component';
import { SectionEditorHeroComponent } from 'src/app/editor/article-editor/section-editor-hero/section-editor-hero.component';
import { SectionEditorHtmlComponent } from 'src/app/editor/article-editor/section-editor-html/section-editor-html.component';
import { SectionEditorImagesComponent } from 'src/app/editor/article-editor/section-editor-images/section-editor-images.component';
import { SectionEditorTitleComponent } from 'src/app/editor/article-editor/section-editor-title/section-editor-title.component';
import { SectionEditorTextComponent } from 'src/app/editor/article-editor/text-section-editor/section-editor-text.component';
import { AlertService } from 'src/app/services/alert.service';
import { createArticleStyle, renderArticleSection, sectionLabels } from 'src/app/services/article-renderer';
import { CmsRequestService } from 'src/app/services/cms-request.service';
import { ModalService } from 'src/app/services/modal.service';
import { bootstrapEye } from '@ng-icons/bootstrap-icons';

@Component({
  selector: 'app-article-editor',
  imports: [SectionEditorTextComponent, NgIcon, SectionEditorImagesComponent, SectionEditorTitleComponent, SectionEditorAnimalListComponent, SectionEditorHtmlComponent, SectionEditorHeroComponent, AsyncPipe],
  providers: [provideIcons({bootstrapGripVertical, bootstrapX, bootstrapPlus, bootstrapEye})],
  templateUrl: './article-editor.component.html',
  styleUrl: './article-editor.component.scss',
  //changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArticleEditorComponent implements OnInit {

  articleId = input.required<string>();

  article = signal<CmsArticle | undefined>(createEmptyArticle());
  movedItem = signal<{ row: number, column: number, sectionRef: Section } | null>(null);

  saveArticle = input<Observable<void>>();

  isPreviewMode = signal<boolean>(false);

  sectionLabels = sectionLabels;

  constructor(
    private modalService: ModalService,
    private alertService: AlertService,
    private cmsRequestService: CmsRequestService,
    private domSanitizer: DomSanitizer,
    private renderer: Renderer2,
    private destroyRef: DestroyRef,
  ) {

    this.addGlobalStyle();

    effect(async () => {
      const articleId = this.articleId();
      if (!articleId || articleId == '') {
        this.article.set(createEmptyArticle());
      }
      const article = await lastValueFrom(this.cmsRequestService.getArticle(articleId));
      this.article.set(article);
    });
  }

  ngOnInit() {
    this.saveArticle()?.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.save());
  }

  public enterMoveMode(row: number, column: number, sectionRef: Section) {
    this.movedItem.set({row, column, sectionRef})
  }

  public async addSectionAt(row: number, column: number) {
    if (!this.article() || this.isPreviewMode()) return;
    if (this.movedItem()) return;
    const sectionType = await this.modalService.openFinishable(PickNewSectionComponent);
    if (!sectionType) return;

    const sectionRef: Section = createEmptySection(sectionType);

    const article = this.article()!;
    const newRef = article.Structure.Rows[row];
    newRef.Sections.splice(column, 0, sectionRef);

    this.exitMoveMode();
    setTimeout(() => this.editSectionAtPosition(row, column), 0);
  }

  private editSectionAtPosition(row: number, column: number) {
    const rowElement = document.querySelectorAll('.article-row')[row];
    const sectionElement = rowElement.querySelectorAll<HTMLDivElement>('.article-column')[column];
    this.editSection(sectionElement)
  }

  public async addSectionAtNewRow(row: number) {
    if (!this.article() || this.isPreviewMode()) return;
    if (this.movedItem()) return;
    const article = this.article()!;

    const sectionType = await this.modalService.openFinishable(PickNewSectionComponent);
    if (!sectionType) return;

    const sectionRef = createEmptySection(sectionType);
    const newRow: CmsArticleRow = {
      Sections: [sectionRef]
    }

    article.Structure.Rows.splice(row, 0, newRow);
    this.cleanupEmptyRows(article);

    this.exitMoveMode();
    setTimeout(() => this.editSectionAtPosition(row, 0), 0);
  }

  addGlobalStyle(css: string = createArticleStyle()) {
    const styleEl = this.renderer.createElement('style');
    this.renderer.setProperty(styleEl, 'textContent', css);
    this.renderer.appendChild(document.head, styleEl);
  }


  public async save() {
    if (!this.article()) return;
    await lastValueFrom(this.cmsRequestService.saveArticle(this.article()!));
  }

  public exitMoveMode() {
    setTimeout(() => {
      this.movedItem.set(null)
    this.triggerRerender();
    }, 0);
  }

  public moveToNewRow(row: number) {
    if (!this.article()) return;
    const movedItem = this.movedItem();
    if (!movedItem) return;
    const article = this.article()!;
    const newRow: CmsArticleRow = {
      Sections: [movedItem.sectionRef]
    }

    if (movedItem.row != -1) {
      article.Structure.Rows[movedItem.row].Sections.splice(movedItem.column, 1)
    }

    article.Structure.Rows.splice(row, 0, newRow);
    this.cleanupEmptyRows(article);
    this.exitMoveMode();
  }

  public moveToColumn(row: number, column: number) {
    if (!this.article()) return;
    const movedItem = this.movedItem();
    if (!movedItem) return;
    const article = this.article()!;
    const newRow = article.Structure.Rows[row];

    if (movedItem.row != -1) {
      article.Structure.Rows[movedItem.row].Sections.splice(movedItem.column, 1);
    }

    newRow.Sections.splice(column, 0, movedItem.sectionRef);
    this.cleanupEmptyRows(article);
    this.exitMoveMode();
  }

  public async deleteSection(row: number, column: number): Promise<void> {
    if (!this.article()) return;
    const answer = await this.alertService.openAlert("Sektion wirklich entfernen?", "", ["nein", "ja"])
    if (answer == 'ja') {
      const article = this.article()!;
      article.Structure.Rows[row].Sections.splice(column, 1);
      this.cleanupEmptyRows(article);
    }
  }

  private cleanupEmptyRows(article: CmsArticle) {
    article.Structure.Rows = article.Structure.Rows.filter((row: CmsArticleRow) => row.Sections.length > 0)
    this.article.set(article);
  }

  protected editSection(articleColumn: HTMLDivElement, mouseEvent?: MouseEvent) {
    if (this.isPreviewMode()) return;
    mouseEvent?.stopPropagation();
    document.querySelectorAll('.article-column').forEach(el => el.classList.remove('edit-mode'));
    articleColumn.classList.add('edit-mode');
  }

  @HostListener('document:click', ['$event'])
  deselectSections(_: any) {
    const wasInEditMode = !!document.querySelector('.article-column.edit-mode');
    document.querySelectorAll('.article-column').forEach(el => el.classList.remove('edit-mode'));
    if(wasInEditMode) {
      this.triggerRerender();
    }
  }

  public triggerRerender() {
    this.triggerRerenderVal.update(v => v + 1);
  }


  triggerRerenderVal = signal(0);
  renderedSections = computed(async () => {
    this.triggerRerenderVal();
    const article = this.article();

    const sections: SafeHtml[][] = [];

    for (const row of article?.Structure.Rows ?? []) {
      const rowHtml: SafeHtml[] = [];
      for (const section of row.Sections) {
        const html = this.domSanitizer.bypassSecurityTrustHtml(await renderArticleSection(section));
        rowHtml.push(html);
      }
      sections.push(rowHtml);
    }

    return sections;

  });

}
