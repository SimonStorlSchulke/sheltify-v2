import { DialogRef } from '@angular/cdk/dialog';
import { Component, signal, inject, ChangeDetectionStrategy } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { CmsImage } from 'sheltify-lib/dist/cms-types';
import { MediaEntryComponent } from '@app/media-library/media-entry/media-entry.component';
import { CmsRequestService } from '@app/services/cms-request.service';
import { FinishableDialog } from '@app/services/modal.service';

@Component({
  selector: 'app-unused-mediafiles',
  imports: [
    MediaEntryComponent
  ],
  templateUrl: './unused-mediafiles.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './unused-mediafiles.component.scss',
})
export class UnusedMediafilesComponent extends FinishableDialog<string[]> {
  private cmsRequestService = inject(CmsRequestService);
  dialogRef = inject(DialogRef);

  unusedMediafiles: CmsImage[] = [];

  selectedEntries = signal<Set<string>>(new Set());

  ngOnInit() {
    this.selectedEntries.set(new Set(this.unusedMediafiles.map(m => m.ID)))
  }

  toggleSelectEntry(ID: string) {
    this.selectedEntries.update(entries => {

      if(entries.has(ID)) {
        entries.delete(ID);
      } else {
        entries.add(ID);
      }

      return new Set(entries)
    });
  }

  async submitDelete() {
    const ids = Array.from(this.selectedEntries());
    await firstValueFrom(this.cmsRequestService.deleteImages(ids));
    this.finishWith(ids);
  }
}
