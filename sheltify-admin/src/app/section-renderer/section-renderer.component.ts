import { Component, CUSTOM_ELEMENTS_SCHEMA, input } from '@angular/core';
import { Section } from 'sheltify-lib/article-types';
import { CmsRequestService } from 'src/app/services/cms-request.service';

@Component({
  selector: 'app-section-renderer',
  imports: [],
  templateUrl: './section-renderer.component.html',
  styleUrl: './section-renderer.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SectionRendererComponent {
  public section = input<Section>();
  public uploadsUrl = CmsRequestService.publicApiUrl + 'uploads/';
}
