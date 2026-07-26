import { Service, signal, inject } from '@angular/core';
import { ModalService } from '@app/services/modal.service';
import { ColorPickerDialogComponent } from '@app/ui/color-picker-dialog/color-picker-dialog.component';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { CmsTag } from 'sheltify-lib/cms-types';
import { CmsRequestService } from '@app/services/cms-request.service';

@Service()
export class TagsService {
  private cmsRequestService = inject(CmsRequestService);
  private modalService = inject(ModalService);

  availableTags = signal<CmsTag[]>([]);

  async createTag(name: string, color?: string) {
    if(!color) {
      color = await this.modalService.openFinishable(ColorPickerDialogComponent) ?? '#aaa;'
    }
    console.log(color)
    const tag = await firstValueFrom(
      this.cmsRequestService.createTag({
        InternalNote: '',
        Name: name,
        Color: color,
      })
    )
    this.availableTags.update(tags => [...tags, tag]);
    return tag;
  }

  async updateAvailableTags() {
    this.availableTags.set(await lastValueFrom(this.cmsRequestService.getTags()));
  }
}
