import { Component, input, ChangeDetectionStrategy, output, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CmsRequestService } from '@app/services/cms-request.service';
import { debounceTime, firstValueFrom, Subject, Subscription } from 'rxjs';
import { SectionHomeFound } from 'sheltify-lib/article-types';
import { DatePickerComponent } from '@app/forms/date-picker/date-picker.component';

@Component({
  selector: 'app-section-editor-home-found',
  imports: [
    FormsModule,
    DatePickerComponent,
  ],
  templateUrl: './section-editor-home-found.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './section-editor-home-found.component.scss',
})
export class SectionEditorHomeFoundComponent {
  private cmsRequestService = inject(CmsRequestService);

  section = input.required<SectionHomeFound>();

  triggerRerender = output<void>();

  onInput = new Subject<void>();
  updateSubscription?: Subscription;

  async ngOnInit() {
    this.updateSubscription = this.onInput.pipe(debounceTime(600)).subscribe(() => this.updateTempData());
    this.updateTempData();
  }

  async updateTempData() {
    //this.section().TempData = (await firstValueFrom(this.cmsRequestService.getHomeFoundEntries()));
    this.triggerRerender.emit();
  }
}
