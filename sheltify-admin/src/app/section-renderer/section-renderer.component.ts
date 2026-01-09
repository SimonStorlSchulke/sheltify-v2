import { NgTemplateOutlet } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Section } from 'sheltify-lib/article-types';
import { CmsRequestService } from 'src/app/services/cms-request.service';

@Component({
  selector: 'app-section-renderer',
  imports: [NgTemplateOutlet],
  templateUrl: './section-renderer.component.html',
  styleUrl: './section-renderer.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SectionRendererComponent {
  public section = input.required<Section>();
  public uploadsUrl = CmsRequestService.publicApiUrl + 'uploads/';

  public domSanitizer= inject(DomSanitizer);

}
