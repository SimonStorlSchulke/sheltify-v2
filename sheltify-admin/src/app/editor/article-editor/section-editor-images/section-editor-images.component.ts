import { Component, input } from '@angular/core';
import { SectionImages } from 'sheltify-lib/article-types';
import { ImagePickerMultiComponent } from 'src/app/forms/image-picker-multi/image-picker-multi.component';

@Component({
  selector: 'app-section-editor-images',
  imports: [
    ImagePickerMultiComponent
  ],
  templateUrl: './section-editor-images.component.html',
  styleUrl: './section-editor-images.component.scss',
})
export class SectionEditorImagesComponent {
  section = input.required<SectionImages>();
}
