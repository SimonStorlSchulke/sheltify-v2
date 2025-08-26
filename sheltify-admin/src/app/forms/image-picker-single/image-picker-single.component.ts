import { Component, model, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { CmsImage } from 'src/app/cms-types/cms-types';
import { InputBaseComponent } from 'src/app/forms/input-base.component';
import { MediaLibraryComponent } from 'src/app/media-library/media-library.component';
import { CmsImageDirective } from 'src/app/ui/cms-image.directive';
import { bootstrapCardImage } from '@ng-icons/bootstrap-icons'

@Component({
  selector: 'app-image-picker-single',
  imports: [CmsImageDirective, NgIcon, MediaLibraryComponent],
  providers: [provideIcons({bootstrapCardImage})],
  templateUrl: './image-picker-single.component.html',
  styleUrls: ['../form-base.component.scss', './image-picker-single.component.scss']
})
export class ImagePickerSingleComponent extends InputBaseComponent {
  public twoWayModel = model<CmsImage>();

  picking = signal(false);


  public async pickImage() {
    this.picking.set(true);
    const portraits = await this.modalService.openFinishable<CmsImage[], MediaLibraryComponent>(MediaLibraryComponent);
    console.log(portraits[0])
    this.twoWayModel.set(portraits[0]);
  }
}
