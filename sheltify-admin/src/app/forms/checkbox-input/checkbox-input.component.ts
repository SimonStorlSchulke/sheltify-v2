import { Component, model } from '@angular/core';
import { SqlNullBool, SqlNullBoolNull } from 'sheltify-lib/cms-types';
import { InputBaseComponent } from 'src/app/forms/input-base.component';

@Component({
  selector: 'app-checkbox-input',
  imports: [],
  templateUrl: './checkbox-input.component.html',
  styleUrls: ['../form-base.component.scss']
})
export class CheckboxInputComponent extends InputBaseComponent {
  public twoWayModel = model<boolean>(false);
  public nullBoolModel = model<SqlNullBool | undefined>(undefined);

  public onInput(checked: boolean | null) {
    if (checked === null) {
      this.nullBoolModel.set({Bool: false, Valid: false})
    } else {
      this.twoWayModel.set(checked);
      this.nullBoolModel.set({Bool: checked, Valid: true})
    }
  }

  public tooggleNullBool(newBool: boolean) {
    const currentIsValid = this.nullBoolModel()!.Valid;
    const currentBool = this.nullBoolModel()!.Bool;
    if ((newBool && currentBool && currentIsValid) || (!newBool && !currentBool && currentIsValid)) {
      this.nullBoolModel.set(SqlNullBoolNull)
    } else {
      this.nullBoolModel.set({Bool: newBool, Valid: true})
    }
  }
}
