import { DialogRef } from '@angular/cdk/dialog';
import { Component, OnInit, inject, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { AlertService } from '@app/services/alert.service';
import { CmsRequestService } from '@app/services/cms-request.service';
import { TagsService } from '@app/services/tags.service';
import { BtIconComponent } from '@app/ui/bt-icon/bt-icon.component';
import { TagComponent } from '@app/ui/tag/tag.component';
import { CmsTag } from 'sheltify-lib/cms-types';

/** Preset colors for new tags (a custom color can still be picked). */
const tagColors = ['#f4a259', '#e76f51', '#e9c46a', '#8ab17d', '#2a9d8f', '#6cb4ee', '#9b8ce0', '#e98ab5', '#b0a8a0'];

@Component({
  selector: 'app-tags-manager',
  imports: [
    TagComponent,
    BtIconComponent,
  ],
  templateUrl: './tags-manager.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './tags-manager.component.scss'
})
export class TagsManagerComponent implements OnInit {
  private cmsRequestSv = inject(CmsRequestService);
  private alertService = inject(AlertService);
  private dialogRef = inject(DialogRef);
  tagsService = inject(TagsService);

  readonly tagColors = tagColors;

  newName = signal('');
  newColor = signal(tagColors[0]);
  search = signal('');
  isSaving = signal(false);

  nameExists = computed(() => {
    const name = this.newName().trim().toLowerCase();
    return !!name && this.tagsService.availableTags().some(tag => tag.Name.toLowerCase() === name);
  });

  canCreate = computed(() => !!this.newName().trim() && !this.nameExists() && !this.isSaving());

  filteredTags = computed(() => {
    const query = this.search().trim().toLowerCase();
    return [...this.tagsService.availableTags()]
      .filter(tag => !query || tag.Name.toLowerCase().includes(query))
      .sort((a, b) => a.Name.localeCompare(b.Name, 'de'));
  });

  async ngOnInit() {
    await this.tagsService.updateAvailableTags();
  }

  async createTag() {
    if (!this.canCreate()) return;
    this.isSaving.set(true);
    try {
      const createdTag = await lastValueFrom(this.cmsRequestSv.createTag({
        InternalNote: '',
        Name: this.newName().trim(),
        Color: this.newColor(),
      }));
      this.tagsService.availableTags.update(tags => [createdTag, ...tags]);
      this.newName.set('');
    } finally {
      this.isSaving.set(false);
    }
  }

  async deleteTag(tag: CmsTag) {
    const answer = await this.alertService.openAlert(
      `Tag „${tag.Name}“ löschen?`,
      'Der Tag wird von allen Bildern entfernt. Die Bilder selbst bleiben erhalten.',
      ['ja', 'nein'],
    );
    if (answer !== 'ja') return;
    await lastValueFrom(this.cmsRequestSv.deleteTag(tag.ID));
    this.tagsService.availableTags.update(tags => tags.filter(t => t.ID != tag.ID));
  }

  close() {
    this.dialogRef.close();
  };
}
