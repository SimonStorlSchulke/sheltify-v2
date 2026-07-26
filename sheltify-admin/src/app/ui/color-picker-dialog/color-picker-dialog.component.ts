import { Component } from '@angular/core';
import { FinishableDialog } from '@app/services/modal.service';

@Component({
  selector: 'app-color-picker-dialog',
  imports: [],
  templateUrl: './color-picker-dialog.component.html',
  styleUrl: './color-picker-dialog.component.scss'
})
export class ColorPickerDialogComponent extends FinishableDialog<string> {
  initialColor = '#496de1';
  submit(color: string) {
    this.finishWith(color);
  }
}
