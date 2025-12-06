import { DialogRef } from '@angular/cdk/dialog';
import { Component, OnInit } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { TextInputComponent } from 'src/app/forms/text-input/text-input.component';
import { CmsRequestService } from 'src/app/services/cms-request.service';
import { TagsService } from 'src/app/services/tags.service';
import { TagComponent } from 'src/app/ui/tag/tag.component';

@Component({
  selector: 'app-tags-manager',
  imports: [
    TagComponent,
    TextInputComponent
  ],
  templateUrl: './tags-manager.component.html',
  styleUrl: './tags-manager.component.scss'
})
export class TagsManagerComponent implements OnInit {

  constructor(
    private cmsRequestSv: CmsRequestService,
    private dialogRef: DialogRef,
    public tagsService: TagsService,
  ) {
  }

  public async ngOnInit() {
    await this.tagsService.updateAvailableTags();
  }

  public async createTag(Name: string, Color: string) {
    const tag = {
      Name,
      Color,
    }
    const createdTag = await lastValueFrom(this.cmsRequestSv.createTag(tag));
    this.tagsService.availableTags.update(tags => [createdTag, ...tags]);
  }

  public async deleteTag(id: string) {
    await lastValueFrom(this.cmsRequestSv.deleteTag(id));
    this.tagsService.availableTags.update(tags => tags.filter(tag => tag.ID != id));
  }

  public close() {
    this.dialogRef.close();
  };
}
