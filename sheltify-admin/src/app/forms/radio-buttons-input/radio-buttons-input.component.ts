import { Component, input, model } from '@angular/core';
import { InputBaseComponent } from 'src/app/forms/input-base.component';

@Component({
  selector: 'app-radio-buttons-input',
  imports: [],
  templateUrl: './radio-buttons-input.component.html',
  styleUrls: ['../form-base.component.scss']
})
export class RadioButtonsInputComponent extends InputBaseComponent{

  options = input.required<string[]>();
  optionImages = input<string[]>();
  optionTranslations = input<string[]>([]);

  twoWayModel = model<string | undefined>(undefined);

  onInput(option: string) {
    this.askSaveService.markDirty();
    this.twoWayModel.set(option);
  }
}
