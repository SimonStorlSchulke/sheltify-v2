import { ChangeDetectionStrategy, Component, inject, input, model } from '@angular/core';
import { InputBaseComponent } from '@app/forms/input-base.component';
import { ModalPresenter } from '@app/services/modal.presenter';
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

  private modalPresenter = inject(ModalPresenter);

  async pickImage() {
    this.askSaveService.markDirty();
    const portraits = await this.modalPresenter.openMediaLibrary(this.twoWayModel());
    if(!portraits) return;
    this.twoWayModel.set(portraits[0]);
  }

  async editImage() {
    console.log("AAA")
    this.modalPresenter.openImageEditor(this.twoWayModel()!)
  }
}
