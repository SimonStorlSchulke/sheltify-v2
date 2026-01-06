import { Component, input } from '@angular/core';
import { SectionImages } from 'sheltify-lib/article-types';
import { CmsImage } from 'sheltify-lib/cms-types';
import { ImagePickerMultiComponent } from 'src/app/forms/image-picker-multi/image-picker-multi.component';
import { RadioButtonsInputComponent } from 'src/app/forms/radio-buttons-input/radio-buttons-input.component';

@Component({
  selector: 'app-section-editor-images',
  imports: [
    ImagePickerMultiComponent,
    RadioButtonsInputComponent
  ],
  templateUrl: './section-editor-images.component.html',
  styleUrl: './section-editor-images.component.scss',
})
export class SectionEditorImagesComponent {
  public section = input.required<SectionImages>();

  protected setImages(images: CmsImage[]) {
    this.section().Content.MediaFiles = images;
    console.log("AAA", images.map(i => i.Title));
  }
}
