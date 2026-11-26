import { NgTemplateOutlet } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, input, ChangeDetectionStrategy, inject } from '@angular/core';
import { RenderTrustedHtmlComponent } from '@app/section-renderer/render-html/render-trusted-html.component';
import { Section } from 'sheltify-lib/article-types';
import { CmsRequestService } from '@app/services/cms-request.service';
import { TenantConfigurationService } from '@app/services/tenant-configuration.service';

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
  /** used by the text section to show the values of placeholders like "{{Address}}" */
  tenantConfig = inject(TenantConfigurationService).config;
}
