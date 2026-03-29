import { Component, input, model, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgOptionComponent, NgSelectComponent } from '@ng-select/ng-select';
import { SectionBlogs } from 'sheltify-lib/article-types';
import { CheckboxInputComponent } from 'src/app/forms/checkbox-input/checkbox-input.component';
import { NumberInputComponent } from 'src/app/forms/number-input/number-input.component';
import { TenantConfigurationService } from 'src/app/services/tenant-configuration.service';

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
  styleUrl: './section-editor-blogs.component.scss',
})
export class SectionEditorBlogsComponent {
  section = input.required<SectionBlogs>();
  allCategories = signal<string[]>([]);
  selectedCategories = model<string[]>([]);

  constructor(tenantConfigurationService: TenantConfigurationService) {
    tenantConfigurationService.blogCategories().then(result => {
      console.log(result);
      this.allCategories.set(result)
    });
  }

}
