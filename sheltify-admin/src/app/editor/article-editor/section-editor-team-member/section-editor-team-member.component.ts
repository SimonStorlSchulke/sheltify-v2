import { Component, input, ChangeDetectionStrategy } from "@angular/core";
import { ImagePickerSingleComponent } from '@app/forms/image-picker-single/image-picker-single.component';
import { NumberInputComponent } from '@app/forms/number-input/number-input.component';
import { TextInputComponent } from '@app/forms/text-input/text-input.component';
import { SectionTeamMember } from "sheltify-lib/article-types";

@Component({
  selector: "app-section-editor-team-member",
  templateUrl: "./section-editor-team-member.component.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: "./section-editor-team-member.component.scss",
  imports: [
    ImagePickerSingleComponent,
    NumberInputComponent,
    TextInputComponent
  ]
})
export class SectionEditorTeamMember {
  section = input.required<SectionTeamMember>();
}
