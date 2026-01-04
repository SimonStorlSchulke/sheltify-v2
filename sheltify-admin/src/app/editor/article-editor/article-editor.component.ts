import { AsyncPipe } from '@angular/common';
import { Component, computed, DestroyRef, effect, HostListener, input, OnInit, Renderer2, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { bootstrapGripVertical, bootstrapX, bootstrapPlus } from '@ng-icons/bootstrap-icons';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lastValueFrom, Observable, Subject } from 'rxjs';
import { CmsArticle, Section } from 'sheltify-lib/article-types';
import { createEmptyArticle } from 'src/app/cms-types/cms-type.factory';
import { createEmptySection } from 'src/app/editor/article-editor/article-section.factory';
import { PickNewSectionComponent } from 'src/app/editor/article-editor/pick-new-section/pick-new-section.component';
import { SectionEditorComponent } from 'src/app/editor/article-editor/section-editor/section-editor.component';
import { AlertService } from 'src/app/services/alert.service';
import { createArticleStyle, sectionLabels } from 'src/app/services/article-renderer';
import { CmsRequestService } from 'src/app/services/cms-request.service';
import { ModalService } from 'src/app/services/modal.service';
import { bootstrapEye } from '@ng-icons/bootstrap-icons';

@Component({
  selector: 'app-article-editor',
  imports: [NgIcon, FormsModule, SectionEditorComponent],
  providers: [provideIcons({bootstrapGripVertical, bootstrapX, bootstrapPlus, bootstrapEye})],
  templateUrl: './article-editor.component.html',
  styleUrl: './article-editor.component.scss',
})
export class ArticleEditorComponent implements OnInit {

  articleId = input.required<string>();

  article = signal<CmsArticle | undefined>(createEmptyArticle());
  movedItem = signal<{ row: number, column: number, sectionRef: Section } | null>(null);

  saveArticle = input<Observable<void>>();

  isPreviewMode = signal<boolean>(false);

  constructor(
    private modalService: ModalService,
    private alertService: AlertService,
    private cmsRequestService: CmsRequestService,
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

  private editSectionAtPosition(row: number, column: number) {
    const rowElement = document.querySelectorAll('.article-row')[row];
    const sectionElement = rowElement.querySelectorAll<HTMLDivElement>('.article-column')[column];
    //this.editSection(sectionElement)
  }

  public async addSectionAtNewRow(row: number) {
    if (!this.article() || this.isPreviewMode()) return;
    if (this.movedItem()) return;
    const article = this.article()!;

    const sectionType = await this.modalService.openFinishable(PickNewSectionComponent);
    if (!sectionType) return;

    const sectionRef = createEmptySection(sectionType);

    article.Structure.Rows.splice(row, 0, sectionRef);
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
    await lastValueFrom(this.cmsRequestService.saveArticle(this.article()!));
  }

  public exitMoveMode() {
    setTimeout(() => {
      this.movedItem.set(null)
    }, 0);
  }

  public moveToNewRow(row: number) {
    if (!this.article()) return;
    const movedItem = this.movedItem();
    if (!movedItem) return;
    const article = this.article()!;

    if (movedItem.row != -1) {
      article.Structure.Rows.splice(movedItem.column, 1)
    }

    article.Structure.Rows.splice(row, 0, movedItem.sectionRef);
    this.cleanupEmptyRows(article);
    this.exitMoveMode();
  }

  public moveToRow(row: number) {
    if (!this.article()) return;
  }

  public async deleteSection(row: number): Promise<void> {
    if (!this.article()) return;
    const answer = await this.alertService.openAlert("Sektion wirklich entfernen?", "", ["nein", "ja"])
    if (answer == 'ja') {
      const article = this.article()!;
      article.Structure.Rows.splice(row, 1);
      this.cleanupEmptyRows(article);
    }
  }

  private cleanupEmptyRows(article: CmsArticle) {
    //article.Structure.Rows = article.Structure.Rows.filter((row: CmsArticleRow) => row.Sections.length > 0)
    this.article.set(article);
  }
}
