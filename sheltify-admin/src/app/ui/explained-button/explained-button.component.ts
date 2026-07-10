import { Component, input, output } from '@angular/core';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'app-explained-button',
  imports: [],
  templateUrl: './explained-button.component.html',
})
export class ExplainedButtonComponent {
  public action = output();
  public text = input<string>('');
  public explainer = input<string>('');
  public secondary = input<boolean>(false);
  public small = input<boolean>(false);

  constructor(private readonly alertService: AlertService) {
  }

  public showExplainer() {
    this.alertService.openAlert(this.text(), this.explainer()!)
  }
}
