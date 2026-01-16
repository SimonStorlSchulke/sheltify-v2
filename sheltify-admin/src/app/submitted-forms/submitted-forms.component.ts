import { Component, inject, signal } from '@angular/core';
import { LeftSidebarLayoutComponent } from '../layout/left-sidebar-layout/left-sidebar-layout.component';
import { CmsRequestService } from '../services/cms-request.service';
import { DatePipe } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { CmsFormSubmission } from 'sheltify-lib/cms-types';
import { AlertService } from '../services/alert.service';

@Component({
  selector: 'app-submitted-forms',
  imports: [LeftSidebarLayoutComponent, DatePipe],
  templateUrl: './submitted-forms.component.html',
  styleUrl: './submitted-forms.component.scss',
})
export class SubmittedFormsComponent {
  public animals = signal<CmsFormSubmission[]>([]);
  private cmsRequestService = inject(CmsRequestService);
  private alertService = inject(AlertService);
  public forms = signal<CmsFormSubmission[]>([]);
  public selectedForm = signal<CmsFormSubmission | undefined>(undefined);

  constructor() {
    this.reloadForms();
  }

  public async reloadForms() {
    const forms = await firstValueFrom(
      this.cmsRequestService.getSubmittedForms()
    );
    this.forms.set(forms);
  }

  public async toForm(id: string) {
    const form = await firstValueFrom(
      this.cmsRequestService.getSubmittedForm(id)
    );
    this.selectedForm.set(form);
  }

  public async deleteForm() {
    if (!(await this.alertService.confirmDelete())) return;
    await firstValueFrom(
      this.cmsRequestService.deleteSubmittedForms([this.selectedForm()!.ID])
    );
    this.forms.update((forms) =>
      forms.filter((f) => f.ID !== this.selectedForm()!.ID)
    );
  }
}
