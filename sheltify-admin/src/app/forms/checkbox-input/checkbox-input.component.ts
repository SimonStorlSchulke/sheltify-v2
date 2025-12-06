import { Component, model } from '@angular/core';
import { InputBaseComponent } from 'src/app/forms/input-base.component';

@Component({
  selector: 'app-checkbox-input',
  imports: [],
  templateUrl: './checkbox-input.component.html',
  styleUrls: ['../form-base.component.scss']
})
export class CheckboxInputComponent extends InputBaseComponent {
  public twoWayModel = model<boolean>(false);

  public onInput(checked: boolean) {
    this.twoWayModel.set(checked);
  }
}
