import { Component, input, ChangeDetectionStrategy, inject, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AlertService } from '@app/services/alert.service';
import { CmsRequestService } from '@app/services/cms-request.service';
import { TenantConfigurationService } from '@app/services/tenant-configuration.service';
import { debounceTime, firstValueFrom, Subject, Subscription } from 'rxjs';
import { SectionHomeFoundFeedback } from 'sheltify-lib/article-types';
import { DatePickerComponent } from '@app/forms/date-picker/date-picker.component';

@Component({
  selector: 'app-section-editor-home-found-feedback',
  imports: [
    FormsModule,
    DatePickerComponent,
  ],
  templateUrl: './section-editor-home-found-feedback.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './section-editor-home-found-feedback.component.scss',
})
export class SectionEditorHomeFoundFeedbackComponent {
  private cmsRequestService = inject(CmsRequestService);
  tenantConfigurationService = inject(TenantConfigurationService);
  alertService = inject(AlertService);

  triggerRerender = output<void>();

  section = input.required<SectionHomeFoundFeedback>();

  onInput = new Subject<void>();
  updateSubscription?: Subscription;


  async ngOnInit() {
    this.updateSubscription = this.onInput.pipe(debounceTime(600)).subscribe(() => this.updateTempData());
    this.updateTempData();
  }

  async updateTempData() {
    this.section().TempData = (await firstValueFrom(this.cmsRequestService.getHomeFoundEntries()));
    this.triggerRerender.emit();
  }
}
