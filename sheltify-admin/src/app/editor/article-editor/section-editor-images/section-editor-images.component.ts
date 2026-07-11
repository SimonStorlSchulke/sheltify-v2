import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { SectionImages } from 'sheltify-lib/article-types';
import { CmsImage } from 'sheltify-lib/cms-types';
import { ImagePickerMultiComponent } from '@app/forms/image-picker-multi/image-picker-multi.component';
import { RadioButtonsInputComponent } from '@app/forms/radio-buttons-input/radio-buttons-input.component';

@Component({
  selector: 'app-section-editor-images',
  imports: [
    ImagePickerMultiComponent,
    RadioButtonsInputComponent
  ],
  templateUrl: './section-editor-images.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './section-editor-images.component.scss',
})
export class SectionEditorImagesComponent {
  section = input.required<SectionImages>();

  setImages(images: CmsImage[]) {
    this.section().Content.MediaFiles = images;
    console.log("AAA", images.map(i => i.Title));
  }
}
