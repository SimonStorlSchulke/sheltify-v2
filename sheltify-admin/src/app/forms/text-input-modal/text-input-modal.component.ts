import { Component, input } from '@angular/core';
import { TextInputComponent } from 'src/app/forms/text-input/text-input.component';
import { FinishableDialog } from 'src/app/services/modal.service';

@Component({
  selector: 'app-text-input-modal',
  imports: [
  ],
  templateUrl: './text-input-modal.component.html',
  styleUrl: './text-input-modal.component.scss',
})
export class TextInputModalComponent extends FinishableDialog<string>{
  label = '';
}
