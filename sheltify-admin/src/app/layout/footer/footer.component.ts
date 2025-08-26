import { Component, inject } from '@angular/core';
import { CmsRequestService } from 'src/app/services/cms-request.service';

@Component({
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
  selector: 'app-footer',
})
export class FooterComponent {
  cmsRequestSv = inject(CmsRequestService);
}
