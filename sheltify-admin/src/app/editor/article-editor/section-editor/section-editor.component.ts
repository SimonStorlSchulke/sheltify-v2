import { NgTemplateOutlet } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, HostListener, input, model, signal, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import { Section } from 'sheltify-lib/article-types';
import { ArticleEditorService } from 'src/app/editor/article-editor/article-editor.service';
import { SectionEditorAllSectionsComponent } from 'src/app/editor/article-editor/section-editor/section-editor-all-sections/section-editor-all-sections.component';
import { SectionRendererComponent } from 'src/app/section-renderer/section-renderer.component';
import { AlertService } from 'src/app/services/alert.service';
import { sectionLabels } from 'src/app/services/article-renderer';

@Component({
  selector: 'app-section-editor',
  imports: [
    NgIcon,
    SectionEditorAllSectionsComponent,
    SectionRendererComponent,
    NgTemplateOutlet,
  ],
  templateUrl: './section-editor.component.html',
  styleUrl: './section-editor.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SectionEditorComponent {
  public section = input.required<Section>();
  public rowIndex = input.required<number>();
  public editable = input.required<boolean>();
  public editedRow = model<number>();

  @ViewChild('outlet', { read: ViewContainerRef }) outletRef!: ViewContainerRef;
  @ViewChild('preview', { read: TemplateRef }) previewRef!: TemplateRef<any>;

  constructor(
    private articleEditorService: ArticleEditorService,
    private elementRef: ElementRef,
    private alertService: AlertService) {
  }

  public triggerRerender() {
    this.outletRef.clear();
    this.outletRef.createEmbeddedView(this.previewRef);
  }

  protected readonly sectionLabels = sectionLabels;

  public copySection() {
    this.articleEditorService.copiedSection.set(this.section());
    this.alertService.openToast('Sektion kann nun über den "Einfügen" Knopf beim Hover zwischen den Sektionen wieder eingefügt werden.', 'Kopiert')
  }

  public cutSection() {
    this.articleEditorService.copiedSection.set(this.section());
    this.alertService.openToast('Sektion kann nun über den "Einfügen" Knopf beim Hover zwischen den Sektionen wieder eingefügt werden.', 'Ausgeschnitten');
    this.articleEditorService.deleteSection(this.rowIndex(), false);
  }

  public enterMoveMode() {
    this.articleEditorService.enterMoveMode(this.rowIndex(), this.section())
  }

  public deleteSection() {
    this.articleEditorService.deleteSection(this.rowIndex());
  }

  @HostListener('document:click', ['$event'])
  deselectSection(event: any) {
    if (this.editedRow() == this.rowIndex()) {

      const target = event!.target as HTMLElement;

      // Only react if the click outside this section editor
      if(this.elementRef.nativeElement.contains(target)) {
        return
      }

      // ...and if the inside <main> (not sidebar)
      if (!target.closest('main')) {
        return;
      }

      this.editedRow.set(-1);
      this.triggerRerender();
    }
  }
}
