import { Component, input, model } from '@angular/core';
import { InputBaseComponent } from 'src/app/forms/input-base.component';

@Component({
  selector: 'app-text-input',
  imports: [],
  templateUrl: './text-input.component.html',
  styleUrls: ['../form-base.component.scss', './text-input.component.scss']
})
export class TextInputComponent extends InputBaseComponent {
  placeholder = input<string>();
  long = input<boolean>(false);
  isEmail = input<boolean>(false);
  twoWayModel = model<string>('');

  onInput(event: Event) {
    this.askSaveService.markDirty();
    this.twoWayModel.set((event.target as HTMLInputElement).value);
  }
}
