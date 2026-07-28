import { Component, input, model, output, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgOptionComponent, NgSelectComponent } from '@ng-select/ng-select';
import { InputBaseComponent } from '@app/forms/input-base.component';

@Component({
  selector: 'app-select-input',
  imports: [
    NgSelectComponent,
    FormsModule,
    NgOptionComponent,
  ],
  templateUrl: './select-input.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['../form-base.component.scss', './select-input.component.scss']
})
export class SelectInputComponent extends InputBaseComponent {
  placeholder = input<string>('');
  twoWayModel = model<string | undefined>('');
  onInputChange = output<string | undefined>();
  options = input.required<string[]>();
  optionTranslations = input<Record<string, string> | undefined>(undefined);
  clearable = input<boolean>(true);

  onInput() {
    this.markDirty();
    this.onInputChange.emit(this.twoWayModel());
  }
}
