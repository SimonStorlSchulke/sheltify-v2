import { DatePipe } from '@angular/common';
import { Component, input, Input, output } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { CmsHomeFoundEntry } from 'sheltify-lib/dist/cms-types';
import { TextEditorComponent } from 'src/app/editor/text-editor/text-editor.component';
import { ImagePickerMultiComponent } from 'src/app/forms/image-picker-multi/image-picker-multi.component';
import { TextInputComponent } from 'src/app/forms/text-input/text-input.component';
import { AlertService } from 'src/app/services/alert.service';
import { CmsRequestService } from 'src/app/services/cms-request.service';

@Component({
  selector: 'app-home-found-editor',
  imports: [
    DatePipe,
    ImagePickerMultiComponent,
    TextEditorComponent,
    TextInputComponent
  ],
  templateUrl: './home-found-editor.component.html',
  styleUrl: './home-found-editor.component.scss',
})
export class HomeFoundEditorComponent {
  public entry = input.required<CmsHomeFoundEntry>();

  public modified = output<void>();

  constructor(
    private alertService: AlertService,
    private cmsRequestService: CmsRequestService,
  ) {
  }

  public async save() {
    await firstValueFrom(this.cmsRequestService.saveHomeFoundEntry(this.entry()));
    this.modified.emit();
  }

  public async delete() {
    const choice = await this.alertService.openAlert('Seite wirklich entfernen?', 'Aktion kann nicht rückgängig gemacht werden', ['ja', 'nein'])
    if (choice !== 'ja') return;
    await firstValueFrom(this.cmsRequestService.deleteHomeFoundEntries([this.entry()!.ID]));
    this.modified.emit();
  }
}
