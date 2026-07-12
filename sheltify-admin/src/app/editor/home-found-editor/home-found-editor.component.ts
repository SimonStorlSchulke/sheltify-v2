import { DatePipe } from '@angular/common';
import { Component, input, Input, output, inject, ChangeDetectionStrategy } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AskSaveService } from '@app/services/ask-save.service';
import { firstValueFrom } from 'rxjs';
import { CmsHomeFoundEntry } from 'sheltify-lib/cms-types';
import { TextEditorComponent } from '@app/editor/text-editor/text-editor.component';
import { ImagePickerMultiComponent } from '@app/forms/image-picker-multi/image-picker-multi.component';
import { TextInputComponent } from '@app/forms/text-input/text-input.component';
import { AlertService } from '@app/services/alert.service';
import { CmsRequestService } from '@app/services/cms-request.service';

@Component({
  selector: 'app-home-found-editor',
  imports: [
    DatePipe,
    ImagePickerMultiComponent,
    TextEditorComponent,
    TextInputComponent
  ],
  templateUrl: './home-found-editor.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './home-found-editor.component.scss',
})
export class HomeFoundEditorComponent {
  private alertService = inject(AlertService);
  private cmsRequestService = inject(CmsRequestService);
  private askSaveService = inject(AskSaveService);

  entry = input.required<CmsHomeFoundEntry>();

  modified = output<void>();

  constructor() {
    this.askSaveService.triggerSave$.pipe(takeUntilDestroyed()).subscribe(() => this.save())
  }

  async save() {
    await firstValueFrom(this.cmsRequestService.saveHomeFoundEntry(this.entry()));
    this.modified.emit();
  }

  async delete() {
    const choice = await this.alertService.openAlert('Seite wirklich entfernen?', 'Aktion kann nicht rückgängig gemacht werden', ['ja', 'nein'])
    if (choice !== 'ja') return;
    await firstValueFrom(this.cmsRequestService.deleteHomeFoundEntries([this.entry()!.ID]));
    this.modified.emit();
  }
}
