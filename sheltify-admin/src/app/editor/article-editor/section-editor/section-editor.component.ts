import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectorRef, Component, computed, CUSTOM_ELEMENTS_SCHEMA, HostListener, input, signal, TemplateRef, viewChild, ViewChild, ViewContainerRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NgIcon } from '@ng-icons/core';
import { Section } from 'sheltify-lib/article-types';
import { ArticleEditorService } from 'src/app/editor/article-editor/article-editor.service';
import { SectionEditorAllSectionsComponent } from 'src/app/editor/article-editor/section-editor/section-editor-all-sections/section-editor-all-sections.component';
import { SectionRendererComponent } from 'src/app/section-renderer/section-renderer.component';
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
  public triggerRerenderVal = signal(0);
  public editMode = signal(false);

  @ViewChild('outlet', { read: ViewContainerRef }) outletRef!: ViewContainerRef;
  @ViewChild('preview', { read: TemplateRef }) previewRef!: TemplateRef<any>;

  constructor(private domSanitizer: DomSanitizer, private articleEditorService: ArticleEditorService, private cdRef: ChangeDetectorRef) {
  }

  renderedTriggerSection = computed(() => {
    console.log("s", this.section());
    return {section: this.section(), trigger: this.triggerRerenderVal()};
  })


  public triggerRerender() {
    this.outletRef.clear();
    this.outletRef.createEmbeddedView(this.previewRef);
  }

  protected readonly sectionLabels = sectionLabels;

  public enterMoveMode() {
    this.articleEditorService.enterMoveMode(this.rowIndex(), this.section())
  }

  public deleteSection() {
    this.articleEditorService.deleteSection(this.rowIndex());
  }

  public enterEditMode(event: MouseEvent) {
    event.stopPropagation();
    this.editMode.set(true);
  }

  @HostListener('document:click', ['$event'])
  deselectSections(event: any) {
    if (this.editMode()) {

      const target = event!.target as HTMLElement;

      // Only react if the click occurred inside <main>
      if (!target.closest('main')) {
        return;
      }

      this.editMode.set(false);
      this.triggerRerender();
    }
  }
}
