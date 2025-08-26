import { Component, input } from '@angular/core';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  template: '',
})
export class InputBaseComponent {
  public name = input.required<string>();
  public explanation = input<string>();
  public label = input.required<string>();

  constructor(private alertService: AlertService) {}

  public showExplanation() {
    this.alertService.openAlert(this.label(), this.explanation()!)
  }
}
