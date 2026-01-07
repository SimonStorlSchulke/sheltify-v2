import { AsyncPipe } from '@angular/common';
import { Component, computed, CUSTOM_ELEMENTS_SCHEMA, HostListener, input, signal } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NgIcon } from '@ng-icons/core';
import { Section } from 'sheltify-lib/article-types';
import { ArticleEditorService } from 'src/app/editor/article-editor/article-editor.service';
import { SectionEditorAllSectionsComponent } from 'src/app/editor/article-editor/section-editor/section-editor-all-sections/section-editor-all-sections.component';
import { renderArticleSection, sectionLabels } from 'src/app/services/article-renderer';

@Component({
  selector: 'app-section-editor',
  imports: [
    AsyncPipe,
    NgIcon,
    SectionEditorAllSectionsComponent,
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

  constructor(private domSanitizer: DomSanitizer, private articleEditorService: ArticleEditorService) {
  }

  public triggerRerender() {
    this.triggerRerenderVal.update(v => v + 1);
  }

  public renderedSection = computed(async () => {
    this.triggerRerenderVal();
    const htmlString = await renderArticleSection(this.section());
    return this.domSanitizer.bypassSecurityTrustHtml(htmlString);
  });

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
