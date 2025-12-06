import { Component, input, model } from '@angular/core';
import { InputBaseComponent } from 'src/app/forms/input-base.component';

@Component({
  selector: 'app-range-input',
  imports: [],
  templateUrl: './range-input.component.html',
  styleUrls: ['../form-base.component.scss', './range-input.component.scss'],
})
export class RangeInputComponent extends InputBaseComponent {
  public twoWayModel = model<[number | undefined, number | undefined]>([undefined, undefined]);
  public min = input<number>(0);
  public max = input<number>(100);
  public stepSize = input<number>(1);

  public onInput(event: Event, minOrMax: 0 | 1) {
    const numberString = (event.target as HTMLInputElement).value;
    const value = numberString ? parseFloat(numberString) : undefined;
    this.twoWayModel.update((values) => {
      values[minOrMax] = value;
      return [...values];
    }
  )
  }
}
