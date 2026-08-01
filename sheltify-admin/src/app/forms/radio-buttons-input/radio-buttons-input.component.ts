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
  multiSelect = input(false);
  optionImages = input<string[]>();
  optionTranslations = input<string[]>([]);

  twoWayModel = model<string | undefined>(undefined);
  twoWayModelMulti = model<string[] | undefined>(undefined);

  onInput(option: string) {
    this.markDirty();

    if(this.multiSelect()) {
      const current = this.twoWayModelMulti() ?? [];
      if (current.includes(option)) {
        this.twoWayModelMulti.set(current.filter(o => o !== option));
      } else {
        this.twoWayModelMulti.set([...current, option]);
      }
    } else {
      this.twoWayModel.set(option);
    }
  }
}
