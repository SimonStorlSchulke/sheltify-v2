import { DialogRef } from '@angular/cdk/dialog';
import { Component } from '@angular/core';

export type AlertButtonName = 'ok' | 'ja' | 'nein' | 'abbrechen';

@Component({
  selector: 'app-alert',
  imports: [],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.scss'
})
export class AlertComponent {
  title = '';
  message = '';
  type: 'info' | 'error' | 'warning' | '' = '';
  buttons: AlertButtonName[] = [];

  constructor(private dialogRef: DialogRef<AlertComponent>) {
  }

  onButtonClicked(button: AlertButtonName) {
    switch (button) {
      case "ja":
        break;
      case "nein":
        break;
      case "abbrechen":
        break;
      case 'ok':
        this.dialogRef.close();
    }
  }
}
