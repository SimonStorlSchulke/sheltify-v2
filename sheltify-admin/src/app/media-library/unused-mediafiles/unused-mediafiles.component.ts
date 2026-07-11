import { DialogRef } from '@angular/cdk/dialog';
import { Component, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { CmsImage } from 'sheltify-lib/dist/cms-types';
import { MediaEntryComponent } from 'src/app/media-library/media-entry/media-entry.component';
import { CmsRequestService } from 'src/app/services/cms-request.service';
import { FinishableDialog } from 'src/app/services/modal.service';

@Component({
  selector: 'app-unused-mediafiles',
  imports: [
    MediaEntryComponent
  ],
  templateUrl: './unused-mediafiles.component.html',
  styleUrl: './unused-mediafiles.component.scss',
})
export class UnusedMediafilesComponent extends FinishableDialog<string[]> {
  public unusedMediafiles: CmsImage[] = [];

  public selectedEntries = signal<Set<string>>(new Set());

  constructor(
    private cmsRequestService: CmsRequestService,
    public dialogRef: DialogRef,
    ) {
    super();
  }

  ngOnInit() {
    this.selectedEntries.set(new Set(this.unusedMediafiles.map(m => m.ID)))
  }

  public toggleSelectEntry(ID: string) {
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
