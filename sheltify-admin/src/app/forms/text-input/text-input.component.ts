import { Component, input, model } from '@angular/core';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-text-input',
  imports: [],
  templateUrl: './text-input.component.html',
  styleUrls: ['../form-base.component.scss', './text-input.component.scss']
})
export class TextInputComponent {
  public name = input.required<string>();
  public explanation = input<string>();
  public placeholder = input<string>();
  public label = input.required<string>();
  public long = input<boolean>(false);
  public twoWayModel = model<string>('');

  constructor(private modalService: ModalService) {
  }

  public onInput(event: Event): void {
    this.twoWayModel.set((event.target as HTMLInputElement).value);
  }

  public showExplanation() {
    this.modalService.openAlert(this.label(), this.explanation()!)
  }
}
