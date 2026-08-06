import { NgTemplateOutlet } from '@angular/common';
import { Component, computed, CUSTOM_ELEMENTS_SCHEMA, ElementRef, HostListener, input, model, TemplateRef, ViewChild, ViewContainerRef, inject, ChangeDetectionStrategy } from '@angular/core';
import { BtIconComponent } from '@app/ui/bt-icon/bt-icon.component';
import { Section } from 'sheltify-lib/article-types';
import { ArticleEditorService } from '@app/editor/article-editor/article-editor.service';
import { SectionEditorAllSectionsComponent } from '@app/editor/article-editor/section-editor/section-editor-all-sections/section-editor-all-sections.component';
import { SectionRendererComponent } from '@app/section-renderer/section-renderer.component';
import { AlertService } from '@app/services/alert.service';
import { sectionLabels } from '@app/services/article-renderer';

@Component({
  selector: 'app-section-editor',
  imports: [
    SectionEditorAllSectionsComponent,
    SectionRendererComponent,
    NgTemplateOutlet,
    BtIconComponent,
  ],
  templateUrl: './section-editor.component.html',
  styleUrl: './section-editor.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SectionEditorComponent {
  private articleEditorService = inject(ArticleEditorService);
  private elementRef = inject(ElementRef);
  private alertService = inject(AlertService);

  section = input.required<Section>();
  rowIndex = input.required<number>();
  editable = input.required<boolean>();
  editedRow = model<number>();

  public sectionLabel = computed(() => {
    const section = this.section();
    if(!section) return '';
    if(section.SectionType == 'special') return section.Content.Type;
    return sectionLabels.get(section.SectionType) ?? section.SectionType
  })

  @ViewChild('outlet', { read: ViewContainerRef }) outletRef!: ViewContainerRef;
  @ViewChild('preview', { read: TemplateRef }) previewRef!: TemplateRef<any>;

  triggerRerender() {
    this.outletRef.clear();
    this.outletRef.createEmbeddedView(this.previewRef);
  }

  readonly sectionLabels = sectionLabels;

  copySection() {
    this.articleEditorService.copiedSection.set(this.section());
    this.alertService.openToast('Sektion kann nun über den "Einfügen" Knopf beim Hover zwischen den Sektionen wieder eingefügt werden (auch in anderen Artikeln).', 'Kopiert')
  }

  cutSection() {
    this.articleEditorService.copiedSection.set(this.section());
    this.alertService.openToast('Sektion kann nun über den "Einfügen" Knopf beim Hover zwischen den Sektionen wieder eingefügt werden (auch in anderen Artikeln).', 'Ausgeschnitten');
    this.articleEditorService.deleteSection(this.rowIndex(), false);
  }

  enterMoveMode() {
    this.articleEditorService.enterMoveMode(this.rowIndex(), this.section())
  }

  deleteSection() {
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
