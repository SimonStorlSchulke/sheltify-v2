import { NgTemplateOutlet } from '@angular/common';
import { Component, computed, effect, CUSTOM_ELEMENTS_SCHEMA, ElementRef, HostListener, input, model, TemplateRef, ViewChild, ViewContainerRef, inject, ChangeDetectionStrategy, ApplicationRef } from '@angular/core';
import { AskSaveService } from '@app/services/ask-save.service';
import { BtIconComponent } from '@app/ui/bt-icon/bt-icon.component';
import { Section } from 'sheltify-lib/article-types';
import { ArticleEditorService } from '@app/editor/article-editor/article-editor.service';
import { runLayoutTransition } from '@app/editor/article-editor/layout-transition';
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
  private askSaveService = inject(AskSaveService);
  private appRef = inject(ApplicationRef);

  section = input.required<Section>();
  rowIndex = input.required<number>();
  editable = input.required<boolean>();
  editedRow = model<number>();

  sectionLabel = computed(() => {
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

  // Re-render the preview whenever this section stops being edited (clicking outside or
  // selecting another section), because web component renderers don't notice mutations.
  private wasEdited = false;
  private readonly rerenderAfterEditing = effect(() => {
    const isEdited = this.editedRow() === this.rowIndex();
    if (this.wasEdited && !isEdited && this.outletRef) {
      this.triggerRerender();
    }
    this.wasEdited = isEdited;
  });

  copySection() {
    this.articleEditorService.setCopiedSection(this.section());
    this.alertService.openToast('Sektion kann nun über den "Einfügen" Knopf beim Hover zwischen den Sektionen wieder eingefügt werden (auch in anderen Artikeln).', 'Kopiert')
  }

  cutSection() {
    this.articleEditorService.setCopiedSection(this.section());
    this.alertService.openToast('Sektion kann nun über den "Einfügen" Knopf beim Hover zwischen den Sektionen wieder eingefügt werden (auch in anderen Artikeln).', 'Ausgeschnitten');
    this.articleEditorService.deleteSection(this.rowIndex(), false);
    this.askSaveService.markDirty();
  }

  enterMoveMode() {
    this.articleEditorService.enterMoveMode(this.section())
  }

  deleteSection() {
    this.articleEditorService.deleteSection(this.rowIndex());
    this.askSaveService.markDirty();
  }

  private pointerDownOutsideEditor = false;
  @HostListener('document:pointerdown', ['$event'])
  onPointerDown(event: PointerEvent) {
    const target = event.target as HTMLElement;

    this.pointerDownOutsideEditor = !this.elementRef.nativeElement.contains(target);
  }

  @HostListener('document:pointerup', ['$event'])
  deselectSection(event: PointerEvent) {
    if (this.editedRow() !== this.rowIndex()) {
      return;
    }

    const target = event.target as HTMLElement;

    const pointerUpOutsideEditor = !this.elementRef.nativeElement.contains(target);

    // Ignore if either the press or release happened inside the editor.
    if (!this.pointerDownOutsideEditor || !pointerUpOutsideEditor) {
      return;
    }

    // Only react if inside <main> (not sidebar)
    if (!target.closest('main')) {
      return;
    }

    // Clicked another section: selecting it closes this one in the same step (article-editor
    // clickSection), so the layout changes only once.
    if (target.closest('app-section-editor')) {
      return;
    }

    // keep what was clicked in place while this section shrinks back to its preview
    // (the preview is re-rendered by rerenderAfterEditing)
    runLayoutTransition(this.appRef, () => this.editedRow.set(-1), target);
  }
}
