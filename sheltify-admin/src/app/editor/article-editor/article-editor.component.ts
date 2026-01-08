import { Component, DestroyRef, effect, input, OnInit, Renderer2, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { bootstrapGripVertical, bootstrapX, bootstrapPlus } from '@ng-icons/bootstrap-icons';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lastValueFrom, Observable } from 'rxjs';
import { createEmptyArticle } from 'src/app/cms-types/cms-type.factory';
import { ArticleEditorService } from 'src/app/editor/article-editor/article-editor.service';
import { createEmptySection } from 'src/app/editor/article-editor/article-section.factory';
import { PickNewSectionComponent } from 'src/app/editor/article-editor/pick-new-section/pick-new-section.component';
import { SectionEditorComponent } from 'src/app/editor/article-editor/section-editor/section-editor.component';
import { CmsRequestService } from 'src/app/services/cms-request.service';
import { ModalService } from 'src/app/services/modal.service';
import { bootstrapEye } from '@ng-icons/bootstrap-icons';
import { TenantConfigurationService } from 'src/app/services/tenant-configuration.service';

@Component({
  selector: 'app-article-editor',
  imports: [NgIcon, FormsModule, SectionEditorComponent],
  providers: [provideIcons({bootstrapGripVertical, bootstrapX, bootstrapPlus, bootstrapEye})],
  templateUrl: './article-editor.component.html',
  styleUrl: './article-editor.component.scss',
})
export class ArticleEditorComponent implements OnInit {

  public articleId = input.required<string>();
  public saveArticle = input<Observable<void>>();
  public isPreviewMode = signal<boolean>(false);

  constructor(
    public articleEditorService: ArticleEditorService,
    private modalService: ModalService,
    private cmsRequestService: CmsRequestService,
    private renderer: Renderer2,
    private destroyRef: DestroyRef,
    private readonly tenantConfigurationService: TenantConfigurationService,
  ) {

    this.tenantConfigurationService.siteUrl().then(siteUrl => siteUrl ? this.addGlobalStyle(siteUrl + 'provided-article-theme.css') : false);

    effect(async () => {
      const articleId = this.articleId();
      if (!articleId || articleId == '') {
        this.articleEditorService.article.set(createEmptyArticle());
      }
      const article = await lastValueFrom(this.cmsRequestService.getArticle(articleId));
      this.articleEditorService.article.set(article);
    });
  }

  ngOnInit() {
    this.saveArticle()?.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.save());
  }

  private editSectionAtPosition(row: number, column: number) {
    const rowElement = document.querySelectorAll('.article-row')[row];
    const sectionElement = rowElement.querySelectorAll<HTMLDivElement>('.article-column')[column];
    //this.editSection(sectionElement)
  }

  public async addSectionAtRow(row: number) {
    if (!this.articleEditorService.article() || this.isPreviewMode()) return;
    if (this.articleEditorService.movedItem()) return;
    const article = this.articleEditorService.article()!;

    const sectionType = await this.modalService.openFinishable(PickNewSectionComponent);
    if (!sectionType) return;

    const sectionRef = createEmptySection(sectionType);

    article.Structure.Rows.splice(row, 0, sectionRef);

    this.exitMoveMode();
    setTimeout(() => this.editSectionAtPosition(row, 0), 0);
  }

  addGlobalStyle(css: string) {
    const link = document.createElement( "link" );
    link.href = css;
    link.type = "text/css";
    link.rel = "stylesheet";

    this.renderer.appendChild(document.head, link);
  }

  public async save() {
    await lastValueFrom(this.cmsRequestService.saveArticle(this.articleEditorService.article()!));
  }

  public exitMoveMode() {
    setTimeout(() => {
      this.articleEditorService.exitMoveMode();
    });
  }

  public moveToNewRow(rowTo: number) {
    if (!this.articleEditorService.article()) return;
    const movedItem = this.articleEditorService.movedItem();
    if (!movedItem) return;
    const article = this.articleEditorService.article()!;

    const rowFrom = this.articleEditorService.movedItem()!.row;

    article.Structure.Rows.splice(rowTo, 0, movedItem.sectionRef);
    article.Structure.Rows.splice(rowFrom, 1);
    this.exitMoveMode();
  }
}
