import { Component, effect, inject, input, ModelSignal } from '@angular/core';
import { AlertService } from 'src/app/services/alert.service';
import { AskSaveService } from 'src/app/services/ask-save.service';

@Component({
  template: '',
})
export abstract class InputBaseComponent {
  idName = input.required<string>();
  explanation = input<string>();
  label = input.required<string>();
  abstract twoWayModel: ModelSignal<any>;

  private alertService = inject(AlertService);
  askSaveService = inject(AskSaveService);

  showExplanation() {
    this.alertService.openAlert(this.label(), this.explanation()!)
  }
}
