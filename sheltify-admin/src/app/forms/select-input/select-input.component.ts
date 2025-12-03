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
  public placeholder = input<string>();
  public twoWayModel = model<string>('');
  public options = input.required<string[]>();
  public optionTranslations = input<Record<string, string>>();
  public clearable = input<boolean>(true);

  public onInput(event: Event) {
    this.twoWayModel.set((event.target as HTMLInputElement).value);
  }
}
