import { Component, ElementRef, HostListener, input, model, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgOptionComponent, NgSelectComponent } from '@ng-select/ng-select';
import { TextInputComponent } from 'src/app/forms/text-input/text-input.component';
import { FinishableDialog } from 'src/app/services/modal.service';

@Component({
  selector: 'app-text-input-modal',
  imports: [
    NgSelectComponent,
    NgOptionComponent,
    FormsModule,
    TextInputComponent
  ],
  templateUrl: './button-link-dialog.component.html',
  styleUrl: './button-link-dialog.component.scss',
})
export class ButtonLinkDialogComponent extends FinishableDialog<{ url: string, buttonTye: 'primary' | 'secondary' | 'cto' }>{
  public url = model<string>( '');
  public buttonType: 'primary' | 'secondary' | 'cto' = 'primary';

  submit() {
    this.finishWith({
      url: this.url(),
      buttonTye: this.buttonType,
    });
  }
}
