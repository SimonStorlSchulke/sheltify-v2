import { Component, inject, input } from '@angular/core';
import { AlertService } from '@app/services/alert.service';

@Component({
  selector: 'app-explainer',
  imports: [],
  templateUrl: './explainer.component.html',
  styleUrl: './explainer.component.scss',
})
export class ExplainerComponent {
  alertService = inject(AlertService);

  title = input<string>();
  text = input.required<string>();

  show() {
    this.alertService.openAlert(this.title() ?? '', this.text());
  }
}
