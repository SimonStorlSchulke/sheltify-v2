import { Component, signal } from '@angular/core';
import { TextInputComponent } from 'src/app/forms/text-input/text-input.component';
import { FinishableDialog } from 'src/app/services/modal.service';

@Component({
  selector: 'app-save-animal',
  imports: [
    TextInputComponent
  ],
  templateUrl: './save-animal.component.html',
  styleUrl: './save-animal.component.scss',
})
export class SaveAnimalComponent extends FinishableDialog<{updateNote: string, pushUpdate: boolean}> {
  public updateNote = signal<string>('');

  public sendSaveInfo(pushUpdate: boolean) {
    this.finishWith({
      updateNote: this.updateNote(),
      pushUpdate,
    });
  }

}
