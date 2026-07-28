import { Component, input, model, ChangeDetectionStrategy } from '@angular/core';
import { InputBaseComponent } from '@app/forms/input-base.component';

@Component({
  selector: 'app-radio-buttons-input',
  imports: [],
  templateUrl: './radio-buttons-input.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['../form-base.component.scss']
})
export class RadioButtonsInputComponent extends InputBaseComponent{

  options = input.required<string[]>();
  optionImages = input<string[]>();
  optionTranslations = input<string[]>([]);

  twoWayModel = model<string | undefined>(undefined);

  onInput(option: string) {
    this.markDirty();
    this.twoWayModel.set(option);
  }
}
