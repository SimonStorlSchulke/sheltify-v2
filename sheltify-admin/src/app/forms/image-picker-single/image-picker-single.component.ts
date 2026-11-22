import { ChangeDetectionStrategy, Component, inject, input, model } from '@angular/core';
import { ModalService } from '@app/services/modal.service';
import { InputBaseComponent } from '@app/forms/input-base.component';
import { ImageEditorComponent } from '@app/media-library/image-editor/image-editor.component';
import { MediaLibraryComponent } from '@app/media-library/media-library.component';
import { BtIconComponent } from "@app/ui/bt-icon/bt-icon.component";
import { CmsImageDirective } from '@app/ui/cms-image.directive';
import { bootstrapCardImage } from '@ng-icons/bootstrap-icons'
import { NgIcon, provideIcons } from '@ng-icons/core';
import { CmsImage } from 'sheltify-lib/cms-types';

@Component({
  selector: 'app-image-picker-single',
  imports: [CmsImageDirective, NgIcon, BtIconComponent],
  providers: [provideIcons({bootstrapCardImage})],
  templateUrl: './image-picker-single.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['../form-base.component.scss', './image-picker-single.component.scss']
})
export class ImagePickerSingleComponent extends InputBaseComponent {
  twoWayModel = model<CmsImage>();
  cropped = input(false);
  small = input(false);

  private modalService = inject(ModalService);

  async pickImage() {
    this.markDirty();
    const portraits = await this.modalService.openFinishable(MediaLibraryComponent, {
      isPicker: true,
      preselectedImage: this.twoWayModel(),
      preselectedAnimals: MediaLibraryComponent.contextAnimals(),
    }, 'modal-fullscreen');
    if(!portraits) return;
    this.twoWayModel.set(portraits[0]);
  }

  async editImage() {
    await this.modalService.openFinishable(ImageEditorComponent, {openedAsModalImage: this.twoWayModel()!});
  }
}
