import { Component, ElementRef, HostListener, input, viewChild, ChangeDetectionStrategy } from '@angular/core';
import { TextInputComponent } from '@app/forms/text-input/text-input.component';
import { FinishableDialog } from '@app/services/modal.service';

@Component({
  selector: 'app-text-input-modal',
  imports: [
  ],
  templateUrl: './text-input-modal.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './text-input-modal.component.scss',
})
export class TextInputModalComponent extends FinishableDialog<string>{
  label = '';
  placeHolder = '';
  presetText = '';

  inputElement = viewChild<ElementRef<HTMLInputElement>>('input');

  @HostListener('window:keyup.enter', ['$event'])
  submit(_: Event) {
    this.finishWith(this.inputElement()?.nativeElement.value ?? '');
  }
}
