import { DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { CmsRequestService } from '@app/services/cms-request.service';

@Component({
  selector: 'app-recent-forms',
  imports: [DatePipe, RouterLink],
  templateUrl: './recent-forms.component.html',
  styleUrl: './recent-forms.component.scss',
})
export class RecentFormsComponent {
  private cmsRequestService = inject(CmsRequestService);
  forms = toSignal(this.cmsRequestService.getRecentSubmittedForms());
}
