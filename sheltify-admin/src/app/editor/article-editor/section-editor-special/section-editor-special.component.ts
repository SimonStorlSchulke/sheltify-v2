import { Component, input, ChangeDetectionStrategy } from "@angular/core";
import { SectionSpecial } from "sheltify-lib/article-types";
import { ImagePickerSingleComponent } from '@app/forms/image-picker-single/image-picker-single.component';
import { TextInputComponent } from "@app/forms/text-input/text-input.component";

@Component({
  selector: "app-section-editor-special",
  imports: [TextInputComponent, ImagePickerSingleComponent],
  templateUrl: "./section-editor-special.component.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: "./section-editor-special.component.scss",
})
export class SectionEditorSpecialComponent {
  section = input.required<SectionSpecial>();
}
