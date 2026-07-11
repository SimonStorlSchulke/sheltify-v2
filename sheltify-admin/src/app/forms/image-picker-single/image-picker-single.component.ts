import { Component, inject, Input, input, model, signal, ChangeDetectionStrategy } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { CmsImage } from 'sheltify-lib/cms-types';
import { InputBaseComponent } from '@app/forms/input-base.component';
import { ModalPresenter } from '@app/services/modal.presenter';
import { CmsImageDirective } from '@app/ui/cms-image.directive';
import { bootstrapCardImage } from '@ng-icons/bootstrap-icons'
import { BtIconComponent } from "@app/ui/bt-icon/bt-icon.component";

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

  private modalPresenter = inject(ModalPresenter);

  async pickImage() {
    this.askSaveService.markDirty();
    const portraits = await this.modalPresenter.openMediaLibrary();
    if(!portraits) return;
    this.twoWayModel.set(portraits[0]);
  }
}
