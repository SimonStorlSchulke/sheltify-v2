import { Component, input, model } from '@angular/core';
import { InputBaseComponent } from 'src/app/forms/input-base.component';

@Component({
  selector: 'app-text-input',
  imports: [],
  templateUrl: './text-input.component.html',
  styleUrls: ['../form-base.component.scss', './text-input.component.scss']
})
export class TextInputComponent extends InputBaseComponent {
  public placeholder = input<string>();
  public long = input<boolean>(false);
  public isEmail = input<boolean>(false);
  public twoWayModel = model<string>('');

  public onInput(event: Event) {
    this.askSaveService.markDirty();
    this.twoWayModel.set((event.target as HTMLInputElement).value);
  }
}
