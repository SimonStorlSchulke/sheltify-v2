import { Component, input, output, inject } from '@angular/core';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'app-explained-button',
  imports: [],
  templateUrl: './explained-button.component.html',
})
export class ExplainedButtonComponent {
  private readonly alertService = inject(AlertService);

  action = output();
  text = input<string>('');
  explainer = input<string>('');
  secondary = input<boolean>(false);
  small = input<boolean>(false);

  showExplainer() {
    this.alertService.openAlert(this.text(), this.explainer()!)
  }
}
