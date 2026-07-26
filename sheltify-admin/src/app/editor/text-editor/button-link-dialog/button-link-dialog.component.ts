import { ChangeDetectionStrategy, Component, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TextInputComponent } from '@app/forms/text-input/text-input.component';
import { FinishableDialog } from '@app/services/modal.service';
import { NgOptionComponent, NgSelectComponent } from '@ng-select/ng-select';

@Component({
  selector: 'app-text-input-modal',
  imports: [
    NgSelectComponent,
    NgOptionComponent,
    FormsModule,
    TextInputComponent
  ],
  templateUrl: './button-link-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './button-link-dialog.component.scss',
})
export class ButtonLinkDialogComponent extends FinishableDialog<{ url: string, buttonTye: 'primary' | 'secondary' | 'cto' }>{
  url = model<string>( '');
  buttonType: 'primary' | 'secondary' | 'cto' = 'primary';

  submit() {
    this.finishWith({
      url: this.url(),
      buttonTye: this.buttonType,
    });
  }
}
