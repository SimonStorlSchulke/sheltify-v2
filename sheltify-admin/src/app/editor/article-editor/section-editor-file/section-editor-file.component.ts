import { Component, input } from "@angular/core";
import { SectionFile } from "sheltify-lib/article-types";
import { TextInputComponent } from "src/app/forms/text-input/text-input.component";
import { ImagePickerSingleComponent } from "src/app/forms/image-picker-single/image-picker-single.component";

@Component({
  selector: "app-section-editor-file",
  imports: [TextInputComponent, ImagePickerSingleComponent],
  templateUrl: "./section-editor-file.component.html",
  styleUrl: "./section-editor-file.component.scss",
})
export class SectionEditorFileComponent {
  public section = input.required<SectionFile>();
}
