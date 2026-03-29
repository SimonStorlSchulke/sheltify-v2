import { Component, computed, input, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SqlNullBool, SqlNullBoolNull } from 'sheltify-lib/cms-types';
import { InputBaseComponent } from 'src/app/forms/input-base.component';

@Component({
  selector: 'app-checkbox-input',
  imports: [
    FormsModule
  ],
  templateUrl: './checkbox-input.component.html',
  styleUrls: ['../form-base.component.scss']
})
export class CheckboxInputComponent extends InputBaseComponent {
  public twoWayModel = model<boolean>(false);
  public nullBoolModel = model<SqlNullBool | undefined>(undefined);
  public showYesNo = input<boolean>(true);

  public onInput(checked: boolean) {
    this.twoWayModel.set(checked);
  }

  public checkedState = computed(() => {
    const nullBool = this.nullBoolModel();
    if(!nullBool) return this.twoWayModel();

    if(!nullBool.Valid) return undefined;

    return nullBool.Bool;
  });

  public toggle(newBool: boolean) {
    this.twoWayModel.set(newBool);

    const nullBool = this.nullBoolModel();
    if(!nullBool) return;

    const currentIsValid = nullBool.Valid;
    const currentBool = nullBool.Bool;
    if ((newBool && currentBool && currentIsValid) || (!newBool && !currentBool && currentIsValid)) {
      this.nullBoolModel.set(SqlNullBoolNull())
    } else {
      this.nullBoolModel.set({Bool: newBool, Valid: true})
    }
  }
}
