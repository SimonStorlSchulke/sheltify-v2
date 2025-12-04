import { Component, input, model } from '@angular/core';
import { InputBaseComponent } from 'src/app/forms/input-base.component';

@Component({
  selector: 'app-radio-buttons-input',
  imports: [],
  templateUrl: './radio-buttons-input.component.html',
  styleUrls: ['../form-base.component.scss']
})
export class RadioButtonsInputComponent extends InputBaseComponent{

  public options = input.required<string[]>();
  public optionTranslations = input<string[]>([]);

  public twoWayModel = model<string | undefined>(undefined);

  public onInput(option: string) {
    this.twoWayModel.set(option);
  }
}
