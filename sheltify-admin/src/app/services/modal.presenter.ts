import { Injectable, inject } from '@angular/core';
import { CmsImage } from 'sheltify-lib/cms-types';
import { MediaLibraryComponent } from '@app/media-library/media-library.component';
import { ModalService } from '@app/services/modal.service';

@Injectable({providedIn: 'root'})
export class ModalPresenter {
  private modalService = inject(ModalService);


  async openMediaLibrary(): Promise<CmsImage[] | undefined> {
    return await this.modalService.openFinishable<CmsImage[], MediaLibraryComponent>(
      MediaLibraryComponent,
      {
        isPicker: true,
      },
      'modal-fullscreen',
    )
  }
}
