import { NgTemplateOutlet } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, input, ChangeDetectionStrategy } from '@angular/core';
import { RenderTrustedHtmlComponent } from '@app/section-renderer/render-html/render-trusted-html.component';
import { Section } from 'sheltify-lib/article-types';
import { CmsRequestService } from '@app/services/cms-request.service';

@Component({
  selector: 'app-section-renderer',
  imports: [NgTemplateOutlet, RenderTrustedHtmlComponent],
  templateUrl: './section-renderer.component.html',
  styleUrl: './section-renderer.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SectionRendererComponent {
  section = input.required<Section>();
  uploadsUrl = CmsRequestService.publicApiUrl + 'uploads/';
}
