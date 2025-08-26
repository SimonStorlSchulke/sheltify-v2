import { Component, input, model } from '@angular/core';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-checkbox-input',
  imports: [],
  templateUrl: './checkbox-input.component.html',
  styleUrls: ['../form-base.component.scss']
})
export class CheckboxInputComponent {
  public name = input.required<string>();
  public explanation = input<string>();
  public label = input.required<string>();
  public twoWayModel = model<boolean>(false);

  constructor(private modalService: ModalService) {
  }

  public onInput(checked: boolean): void {
    this.twoWayModel.set(checked);
  }

  public showExplanation() {
    this.modalService.openAlert(this.label(), this.explanation()!)
  }
}
