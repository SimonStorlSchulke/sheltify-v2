import { Component } from '@angular/core';
import { FinishableDialog } from 'src/app/services/modal.service';

@Component({
  selector: 'app-color-picker-dialog',
  imports: [],
  templateUrl: './color-picker-dialog.component.html',
  styleUrl: './color-picker-dialog.component.scss'
})
export class ColorPickerDialogComponent extends FinishableDialog<string> {
  public submit(color: string) {
    this.finishWith(color);
  }
}
