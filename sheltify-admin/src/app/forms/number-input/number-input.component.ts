import { Component, input, model, output } from '@angular/core';
import { InputBaseComponent } from 'src/app/forms/input-base.component';

@Component({
  selector: 'app-number-input',
  imports: [],
  templateUrl: './number-input.component.html',
  styleUrls: ['../form-base.component.scss', './number-input.component.scss']
})
export class NumberInputComponent extends InputBaseComponent {
  public placeholder = input<string>();
  public long = input<boolean>(false);
  public twoWayModel = model<number | undefined>(undefined);
  public min = input<number>(0);
  public max = input<number>(100);
  public stepSize = input<number>(1);

  public onInput(event: Event) {
    const numberString = (event.target as HTMLInputElement).value;
    const value = numberString ? parseInt(numberString) : undefined;
    this.twoWayModel.set(value);
  }

}
