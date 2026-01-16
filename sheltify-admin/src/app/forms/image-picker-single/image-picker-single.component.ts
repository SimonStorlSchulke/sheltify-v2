import { Component, inject, input, model, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { CmsImage } from 'sheltify-lib/cms-types';
import { InputBaseComponent } from 'src/app/forms/input-base.component';
import { ModalPresenter } from 'src/app/services/modal.presenter';
import { CmsImageDirective } from 'src/app/ui/cms-image.directive';
import { bootstrapCardImage } from '@ng-icons/bootstrap-icons'
import { BtIconComponent } from "src/app/ui/bt-icon/bt-icon.component";

@Component({
  selector: 'app-image-picker-single',
  imports: [CmsImageDirective, NgIcon, BtIconComponent],
  providers: [provideIcons({bootstrapCardImage})],
  templateUrl: './image-picker-single.component.html',
  styleUrls: ['../form-base.component.scss', './image-picker-single.component.scss']
})
export class ImagePickerSingleComponent extends InputBaseComponent {
  public twoWayModel = model<CmsImage>();
  public objectFitContain = input(false);

  private modalPresenter = inject(ModalPresenter);

  public async pickImage() {
    const portraits = await this.modalPresenter.openMediaLibrary();
    if(!portraits) return;
    this.twoWayModel.set(portraits[0]);
  }
}
