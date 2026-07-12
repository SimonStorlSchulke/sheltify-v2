import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { SectionHero } from 'sheltify-lib/article-types';
import { ImagePickerMultiComponent } from '@app/forms/image-picker-multi/image-picker-multi.component';
import { NumberInputComponent } from '@app/forms/number-input/number-input.component';
import { TextInputComponent } from '@app/forms/text-input/text-input.component';

@Component({
  selector: 'app-section-editor-hero',
  imports: [
    ImagePickerMultiComponent,
    TextInputComponent,
    NumberInputComponent
  ],
  templateUrl: './section-editor-hero.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './section-editor-hero.component.scss',
})
export class SectionEditorHeroComponent {
  section = input.required<SectionHero>();
}
