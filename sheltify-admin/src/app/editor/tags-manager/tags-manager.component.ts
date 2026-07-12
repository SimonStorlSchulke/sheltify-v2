import { DialogRef } from '@angular/cdk/dialog';
import { Component, OnInit, inject, ChangeDetectionStrategy } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { TextInputComponent } from '@app/forms/text-input/text-input.component';
import { CmsRequestService } from '@app/services/cms-request.service';
import { TagsService } from '@app/services/tags.service';
import { TagComponent } from '@app/ui/tag/tag.component';

@Component({
  selector: 'app-tags-manager',
  imports: [
    TagComponent,
    TextInputComponent
  ],
  templateUrl: './tags-manager.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './tags-manager.component.scss'
})
export class TagsManagerComponent implements OnInit {
  private cmsRequestSv = inject(CmsRequestService);
  private dialogRef = inject(DialogRef);
  tagsService = inject(TagsService);


  async ngOnInit() {
    await this.tagsService.updateAvailableTags();
  }

  async createTag(Name: string, Color: string) {
    const tag = {
      Name,
      Color,
    }
    const createdTag = await lastValueFrom(this.cmsRequestSv.createTag(tag));
    this.tagsService.availableTags.update(tags => [createdTag, ...tags]);
  }

  async deleteTag(id: string) {
    await lastValueFrom(this.cmsRequestSv.deleteTag(id));
    this.tagsService.availableTags.update(tags => tags.filter(tag => tag.ID != id));
  }

  close() {
    this.dialogRef.close();
  };
}
