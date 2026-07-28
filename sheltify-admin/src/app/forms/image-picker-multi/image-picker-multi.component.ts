import { Component, inject, model, ChangeDetectionStrategy } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { CmsImage } from 'sheltify-lib/cms-types';
import { InputBaseComponent } from '@app/forms/input-base.component';
import { ModalPresenter } from '@app/services/modal.presenter';
import { CmsImageDirective } from '@app/ui/cms-image.directive';
import { bootstrapCardImage, bootstrapPlus } from '@ng-icons/bootstrap-icons'

@Component({
  selector: 'app-image-picker-multi',
  imports: [CmsImageDirective, NgIcon],
  providers: [provideIcons({bootstrapCardImage, bootstrapPlus})],
  templateUrl: './image-picker-multi.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['../form-base.component.scss', './image-picker-multi.component.scss']
})
export class ImagePickerMultiComponent extends InputBaseComponent {
  twoWayModel = model<CmsImage[]>([]);

  private modalPresenter = inject(ModalPresenter);

  async addImage() {
    this.markDirty();
    const images = await this.modalPresenter.openMediaLibrary();
    if(!images) return;
    this.twoWayModel.set([...this.twoWayModel()!, ...images]);
  }

  removeImage(index: number) {
    this.markDirty();
    this.twoWayModel().splice(index, 1);
  }

  moveImage(index: number, offset: number) {
    this.markDirty();
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
    console.log(newArr.map(i => i.Title));
    this.twoWayModel.set(newArr);
  }

  editImage(image: CmsImage) {
    this.modalPresenter.openImageEditor(image);
  }
}
