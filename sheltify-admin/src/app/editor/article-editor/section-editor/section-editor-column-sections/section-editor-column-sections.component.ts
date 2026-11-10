import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { SectionEditorBlogsComponent } from '@app/editor/article-editor/section-editor-blogs/section-editor-blogs.component';
import { SectionEditorFileComponent } from '@app/editor/article-editor/section-editor-file/section-editor-file.component';
import { SectionEditorFormComponent } from '@app/editor/article-editor/section-editor-form/section-editor-form.component';
import { SectionEditorHomeFoundFeedbackComponent } from '@app/editor/article-editor/section-editor-home-found-feedback/section-editor-home-found-feedback.component';
import { SectionEditorHomeFoundComponent } from '@app/editor/article-editor/section-editor-home-found/section-editor-home-found.component';
import { SectionEditorSpecialComponent } from '@app/editor/article-editor/section-editor-special/section-editor-special.component';
import { SectionEditorTeamMember } from '@app/editor/article-editor/section-editor-team-member/section-editor-team-member.component';
import { BtIconComponent } from '@app/ui/bt-icon/bt-icon.component';
import { Section } from 'sheltify-lib/article-types';
import { SectionEditorHeroComponent } from '@app/editor/article-editor/section-editor-hero/section-editor-hero.component';
import { SectionEditorHtmlComponent } from '@app/editor/article-editor/section-editor-html/section-editor-html.component';
import { SectionEditorImagesComponent } from '@app/editor/article-editor/section-editor-images/section-editor-images.component';
import { SectionEditorTitleComponent } from '@app/editor/article-editor/section-editor-title/section-editor-title.component';
import { SectionEditorVideoComponent } from '@app/editor/article-editor/section-editor-video/section-editor-video.component';
import { SectionEditorTextComponent } from '@app/editor/article-editor/text-section-editor/section-editor-text.component';
import { sectionLabels } from '@app/services/article-renderer';

@Component({
  selector: 'app-section-editor-column-sections',
  imports: [
    SectionEditorHeroComponent,
    SectionEditorHtmlComponent,
    SectionEditorImagesComponent,
    SectionEditorTextComponent,
    SectionEditorTitleComponent,
    SectionEditorVideoComponent,
    SectionEditorBlogsComponent,
    SectionEditorFileComponent,
    SectionEditorFormComponent,
    SectionEditorHomeFoundComponent,
    SectionEditorSpecialComponent,
    SectionEditorHomeFoundFeedbackComponent,
    SectionEditorTeamMember,
    BtIconComponent,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './section-editor-column-sections.component.html',
  styleUrls: ['./section-editor-column-sections.component.scss'],
})
export class SectionEditorColumnSectionsComponent {
  section = input.required<Section>();
  deletedSection = output();
  apply = output();
  readonly sectionLabels = sectionLabels;
}
