import { Component, input } from '@angular/core';
import { SectionHero } from 'sheltify-lib/article-types';
import { ImagePickerMultiComponent } from 'src/app/forms/image-picker-multi/image-picker-multi.component';
import { TextInputComponent } from 'src/app/forms/text-input/text-input.component';

@Component({
  selector: 'app-section-editor-hero',
  imports: [
    ImagePickerMultiComponent,
    TextInputComponent
  ],
  templateUrl: './section-editor-hero.component.html',
  styleUrl: './section-editor-hero.component.scss',
})
export class SectionEditorHeroComponent {
  section = input.required<SectionHero>();
}
