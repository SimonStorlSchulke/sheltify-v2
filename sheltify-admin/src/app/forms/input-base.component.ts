import { Component, input } from '@angular/core';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  template: '',
})
export class InputBaseComponent {
  public name = input.required<string>();
  public explanation = input<string>();
  public label = input.required<string>();

  constructor(protected modalService: ModalService) {}

  public showExplanation() {
    this.modalService.openAlert(this.label(), this.explanation()!)
  }
}
