import { Component, input, model, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { InputBaseComponent } from '@app/forms/input-base.component';

@Component({
  selector: 'app-text-input',
  imports: [],
  templateUrl: './text-input.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['../form-base.component.scss', './text-input.component.scss']
})
export class TextInputComponent extends InputBaseComponent implements OnInit {
  placeholder = input<string>();
  long = input<boolean>(false);
  isEmail = input<boolean>(false);
  twoWayModel = model<string | undefined>('');

  ngOnInit() {
    if(this.twoWayModel() === undefined) {
      this.twoWayModel.set('');
    }
  }

  onInput(event: Event) {
    this.markDirty();
    this.twoWayModel.set((event.target as HTMLInputElement).value);
  }
}
