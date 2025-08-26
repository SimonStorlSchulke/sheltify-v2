import { DialogRef } from '@angular/cdk/dialog';
import { Component } from '@angular/core';
import { FinishableDialog } from 'src/app/services/modal.service';

export type AlertButtonName = 'ok' | 'ja' | 'nein' | 'abbrechen';

@Component({
  selector: 'app-alert',
  imports: [],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.scss'
})
export class AlertComponent extends FinishableDialog<AlertButtonName> {
  title = '';
  message = '';
  type: 'info' | 'error' | 'warning' | '' = '';
  buttons: AlertButtonName[] = [];

  constructor(private dialogRef: DialogRef<AlertComponent>) {
    super();
  }

  onButtonClicked(button: AlertButtonName) {
    this.finishWith(button);
  }
}
