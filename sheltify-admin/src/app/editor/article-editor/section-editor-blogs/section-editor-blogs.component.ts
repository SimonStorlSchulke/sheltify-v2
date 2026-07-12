import { Component, input, model, signal, inject, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgOptionComponent, NgSelectComponent } from '@ng-select/ng-select';
import { SectionBlogs } from 'sheltify-lib/article-types';
import { CheckboxInputComponent } from '@app/forms/checkbox-input/checkbox-input.component';
import { NumberInputComponent } from '@app/forms/number-input/number-input.component';
import { TenantConfigurationService } from '@app/services/tenant-configuration.service';

@Component({
  selector: 'app-section-editor-blogs',
  imports: [
    FormsModule,
    NgSelectComponent,
    NgOptionComponent,
    CheckboxInputComponent,
    NumberInputComponent,
  ],
  templateUrl: './section-editor-blogs.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './section-editor-blogs.component.scss',
})
export class SectionEditorBlogsComponent {
  section = input.required<SectionBlogs>();
  allCategories = signal<string[]>([]);
  selectedCategories = model<string[]>([]);

  constructor() {
    const tenantConfigurationService = inject(TenantConfigurationService);

    tenantConfigurationService.blogCategories().then(result => {
      this.allCategories.set(result)
    });
  }

}
