import { Component, input } from "@angular/core";
import { SectionSpecial } from "sheltify-lib/article-types";
import { TextInputComponent } from "src/app/forms/text-input/text-input.component";
import { BtIconComponent } from 'src/app/ui/bt-icon/bt-icon.component';

@Component({
  selector: "app-section-editor-special",
  imports: [TextInputComponent, BtIconComponent],
  templateUrl: "./section-editor-special.component.html",
  styleUrl: "./section-editor-special.component.scss",
})
export class SectionEditorSpecialComponent {
  public section = input.required<SectionSpecial>();

  protected addProperty() {
    this.section().Content.Properties.push(['',''])
  }

  protected deleteProperty(index: number) {
    this.section().Content.Properties.splice(index, 1);
  }
}
