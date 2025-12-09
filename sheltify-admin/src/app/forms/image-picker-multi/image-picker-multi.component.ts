import { Component, inject, model, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { CmsImage } from 'src/app/cms-types/cms-types';
import { InputBaseComponent } from 'src/app/forms/input-base.component';
import { MediaLibraryComponent } from 'src/app/media-library/media-library.component';
import { ModalService } from 'src/app/services/modal.service';
import { CmsImageDirective } from 'src/app/ui/cms-image.directive';
import { bootstrapCardImage, bootstrapPlus } from '@ng-icons/bootstrap-icons'

@Component({
  selector: 'app-image-picker-multi',
  imports: [CmsImageDirective, NgIcon],
  providers: [provideIcons({bootstrapCardImage, bootstrapPlus})],
  templateUrl: './image-picker-multi.component.html',
  styleUrls: ['../form-base.component.scss', './image-picker-multi.component.scss']
})
export class ImagePickerMultiComponent extends InputBaseComponent {
  public twoWayModel = model<CmsImage[]>([]);


  private modalService = inject(ModalService);

  public async addImage() {
    const images = await this.modalService.openFinishable<CmsImage[], MediaLibraryComponent>(MediaLibraryComponent);
    if(!images) return;
    this.twoWayModel.set([...this.twoWayModel()!, ...images]);
  }

  public removeImage(index: number) {
    this.twoWayModel().splice(index, 1);
  }

  public moveImage(index: number, offset: number) {
    const newArr = [...this.twoWayModel()];
    if (offset < 0 && index <= 0) {
      const item = newArr.shift();
      newArr.push(item!);
    } else if (offset > 0 && index >= newArr.length - 1) {
      const item = newArr.pop();
      newArr.unshift(item!);
    } else {
      [newArr[index + offset], newArr[index]] = [newArr[index], newArr[index + offset]];
    }
    this.twoWayModel.set(newArr);
  }
}
