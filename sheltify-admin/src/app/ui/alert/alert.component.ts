import { Component } from '@angular/core';
import { FinishableDialog } from 'src/app/services/modal.service';

export type AlertChoice = 'ok' | 'ja' | 'nein' | 'abbrechen';

@Component({
  selector: 'app-alert',
  imports: [],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.scss'
})
export class AlertComponent extends FinishableDialog<{choice: AlertChoice, option?: string}> {
  title = '';
  message = '';
  type: 'info' | 'error' | 'warning' | '' = '';
  buttons: AlertChoice[] = [];
  options?: string[];
  optionTranslations?: string[];
  
  public onButtonClicked(button: AlertChoice) {
    this.finishWith({choice: button});
  }

  selectOption(option: string) {
    this.finishWith({choice: 'ok', option});
  }
}
