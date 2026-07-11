import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { TextInputComponent } from '@app/forms/text-input/text-input.component';
import { FinishableDialog } from '@app/services/modal.service';

@Component({
  selector: 'app-save-animal',
  imports: [
    TextInputComponent
  ],
  templateUrl: './save-animal.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './save-animal.component.scss',
})
export class SaveAnimalComponent extends FinishableDialog<{updateNote: string, pushUpdate: boolean}> {
  updateNote = signal<string>('');

  sendSaveInfo(pushUpdate: boolean) {
    this.finishWith({
      updateNote: this.updateNote(),
      pushUpdate,
    });
  }

}
