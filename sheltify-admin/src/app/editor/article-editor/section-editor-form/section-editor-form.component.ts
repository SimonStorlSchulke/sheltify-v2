import { Component, inject, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { type SectionForm, } from 'sheltify-lib/article-types';
import { AlertService } from 'src/app/services/alert.service';
import { AlertChoice } from 'src/app/ui/alert/alert.component';
import { TextInputComponent } from "src/app/forms/text-input/text-input.component";
import { CheckboxInputComponent } from "src/app/forms/checkbox-input/checkbox-input.component";
import { SelectInputComponent } from "src/app/forms/select-input/select-input.component";

@Component({
  selector: 'app-section-editor-form',
  imports: [FormsModule, TextInputComponent, CheckboxInputComponent, SelectInputComponent],
  templateUrl: './section-editor-form.component.html',
  styleUrl: './section-editor-form.component.scss',
})
export class SectionEditorFormComponent {

  section = input.required<SectionForm>();

  public alertService = inject(AlertService);
  d = [''] as unknown as AlertChoice[]

  public async add() {
    this.section().Content
      .Inputs.push({
        Type: 'text',
        Label: 'Neues Feld',
        Required: false,
      });
  }

  public setRadioOptions(_t3: number, $event: string) {
    const input = this.section().Content.Inputs[_t3];
    input.RadioOptions = $event.split(',').map(o => o.trim());
  }

  public moveInputUp(index: number) {
    if (index <= 0) {
      return;
    }
    const inputs = this.section().Content.Inputs;
    [inputs[index - 1], inputs[index]] = [inputs[index], inputs[index - 1]];
  }

  public moveInputDown(index: number) {
    const inputs = this.section().Content.Inputs;
    if (index >= inputs.length - 1) {
      return;
    }
    [inputs[index + 1], inputs[index]] = [inputs[index], inputs[index + 1]];
  }

  public async deleteInput(index: number) {
    this.section().Content.Inputs.splice(index, 1);
  }
}
