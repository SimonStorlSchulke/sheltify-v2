import { Component, effect, inject, input, ModelSignal } from '@angular/core';
import { AlertService } from 'src/app/services/alert.service';
import { AskSaveService } from 'src/app/services/ask-save.service';

@Component({
  template: '',
})
export abstract class InputBaseComponent {
  public idName = input.required<string>();
  public explanation = input<string>();
  public label = input.required<string>();
  public abstract twoWayModel: ModelSignal<any>;

  private alertService = inject(AlertService);
  askSaveService = inject(AskSaveService);

  public showExplanation() {
    this.alertService.openAlert(this.label(), this.explanation()!)
  }
}
