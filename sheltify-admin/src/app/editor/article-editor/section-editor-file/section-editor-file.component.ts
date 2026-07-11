import { Component, input, ChangeDetectionStrategy } from "@angular/core";
import { SectionFile } from "sheltify-lib/article-types";
import { TextInputComponent } from "@app/forms/text-input/text-input.component";
import { ImagePickerSingleComponent } from "@app/forms/image-picker-single/image-picker-single.component";

@Component({
  selector: "app-section-editor-file",
  imports: [TextInputComponent, ImagePickerSingleComponent],
  templateUrl: "./section-editor-file.component.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: "./section-editor-file.component.scss",
})
export class SectionEditorFileComponent {
  section = input.required<SectionFile>();
}
