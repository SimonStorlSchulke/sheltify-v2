import { Component, computed, input, model, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SqlNullBool, SqlNullBoolNull } from 'sheltify-lib/cms-types';
import { InputBaseComponent } from '@app/forms/input-base.component';

@Component({
  selector: 'app-checkbox-input',
  imports: [
    FormsModule
  ],
  templateUrl: './checkbox-input.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['../form-base.component.scss']
})
export class CheckboxInputComponent extends InputBaseComponent {
  twoWayModel = model<boolean>(false);
  nullBoolModel = model<SqlNullBool | undefined>(undefined);
  showYesNo = input<boolean>(true);

  onInput(checked: boolean) {
    this.twoWayModel.set(checked);
  }

  checkedState = computed(() => {
    const nullBool = this.nullBoolModel();
    if(!nullBool) return this.twoWayModel();

    if(!nullBool.Valid) return undefined;

    return nullBool.Bool;
  });

  toggle(newBool: boolean) {
    this.askSaveService.markDirty();
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
