import { Service, inject } from '@angular/core';
import { ImageEditorComponent } from '@app/media-library/image-editor/image-editor.component';
import { firstValueFrom } from 'rxjs';
import { CmsImage } from 'sheltify-lib/cms-types';
import { MediaLibraryComponent } from '@app/media-library/media-library.component';
import { ModalService } from '@app/services/modal.service';

@Service()
export class ModalPresenter {
  private modalService = inject(ModalService);


  async openMediaLibrary(preselectedImage?: CmsImage): Promise<CmsImage[] | undefined> {
    return await this.modalService.openFinishable(
      MediaLibraryComponent,
      {
        isPicker: true,
        preselectedImage,
      },
      'modal-fullscreen',
    )
  }

  async openImageEditor(image: CmsImage) {
    await this.modalService.openFinishable(ImageEditorComponent, {openedAsModalImage: image});
  }
}
