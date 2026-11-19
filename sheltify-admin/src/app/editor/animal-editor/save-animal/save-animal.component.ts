import { Component, signal, ChangeDetectionStrategy, OnInit } from '@angular/core';
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
export class SaveAnimalComponent extends FinishableDialog<{updateNote: string, pushUpdate: boolean}> implements OnInit {
  askForUpdateText = true;
  updateNote = signal<string>('');

  ngOnInit() {
    if(!this.askForUpdateText) {
      this.finishWith({
        updateNote: '',
        pushUpdate: false,
      })
    }
  }

  sendSaveInfo(pushUpdate: boolean) {
    this.finishWith({
      updateNote: this.updateNote(),
      pushUpdate,
    });
  }

}
