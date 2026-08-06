import { Component, inject, input, ModelSignal, ChangeDetectionStrategy } from '@angular/core';
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
  editedId = input<string>();

  abstract twoWayModel: ModelSignal<any>;

  private alertService = inject(AlertService);
  askSaveService = inject(AskSaveService);

  markDirty() {
    this.askSaveService.markDirty(this.editedId());
  }

  showExplanation() {
    this.alertService.openAlert(this.label(), this.explanation()!)
  }
}
