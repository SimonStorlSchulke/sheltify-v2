import { Component, input, model, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgOptionComponent, NgSelectComponent } from '@ng-select/ng-select';
import { InputBaseComponent } from 'src/app/forms/input-base.component';

@Component({
  selector: 'app-select-input',
  imports: [
    NgSelectComponent,
    FormsModule,
    NgOptionComponent,
  ],
  templateUrl: './select-input.component.html',
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
    this.askSaveService.markDirty();
    this.onInputChange.emit(this.twoWayModel());
  }
}
