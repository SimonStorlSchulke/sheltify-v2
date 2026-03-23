import { Component, input } from "@angular/core";
import { SectionSpecial } from "sheltify-lib/article-types";
import { ImagePickerSingleComponent } from 'src/app/forms/image-picker-single/image-picker-single.component';
import { TextInputComponent } from "src/app/forms/text-input/text-input.component";
import { BtIconComponent } from 'src/app/ui/bt-icon/bt-icon.component';

@Component({
  selector: "app-section-editor-special",
  imports: [TextInputComponent, BtIconComponent, ImagePickerSingleComponent],
  templateUrl: "./section-editor-special.component.html",
  styleUrl: "./section-editor-special.component.scss",
})
export class SectionEditorSpecialComponent {
  public section = input.required<SectionSpecial>();
}
