import { Component, input, model, ChangeDetectionStrategy } from '@angular/core';
import { InputBaseComponent } from '@app/forms/input-base.component';

@Component({
  selector: 'app-range-input',
  imports: [],
  templateUrl: './range-input.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['../form-base.component.scss', './range-input.component.scss'],
})
export class RangeInputComponent extends InputBaseComponent {
  twoWayModel = model<[number | undefined, number | undefined]>([undefined, undefined]);
  min = input<number>(0);
  max = input<number>(100);
  stepSize = input<number>(1);

  onInput(event: Event, minOrMax: 0 | 1) {
    this.askSaveService.markDirty();
    const numberString = (event.target as HTMLInputElement).value;
    const value = numberString ? parseFloat(numberString) : undefined;
    this.twoWayModel.update((values) => {
      values[minOrMax] = value;
      return [...values];
    }
  )
  }
}
