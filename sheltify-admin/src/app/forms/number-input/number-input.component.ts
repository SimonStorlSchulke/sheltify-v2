import { Component, input, model, output, ChangeDetectionStrategy } from '@angular/core';
import { InputBaseComponent } from '@app/forms/input-base.component';

@Component({
  selector: 'app-number-input',
  imports: [],
  templateUrl: './number-input.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['../form-base.component.scss', './number-input.component.scss']
})
export class NumberInputComponent extends InputBaseComponent {
  placeholder = input<string>();
  long = input<boolean>(false);
  twoWayModel = model<number | undefined>(undefined);
  min = input<number>(0);
  max = input<number>(100);
  stepSize = input<number>(1);

  onInput(event: Event) {
    this.markDirty();
    const numberString = (event.target as HTMLInputElement).value;
    const value = numberString ? parseInt(numberString) : undefined;
    this.twoWayModel.set(value);
  }

}
