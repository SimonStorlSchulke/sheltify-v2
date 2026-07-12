import { Component, effect, inject, input, ModelSignal, ChangeDetectionStrategy } from '@angular/core';
import { AlertService } from '@app/services/alert.service';
import { AskSaveService } from '@app/services/ask-save.service';

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
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
