import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, computed, input } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { CmsAnimal, CmsHomeFoundEntry } from 'sheltify-lib/dist/cms-types';
import { createHomeFoundEntry } from 'src/app/cms-types/cms-type.factory';
import { TextEditorComponent } from 'src/app/editor/text-editor/text-editor.component';
import { ImagePickerMultiComponent } from 'src/app/forms/image-picker-multi/image-picker-multi.component';
import { CmsRequestService } from 'src/app/services/cms-request.service';

@Component({
  selector: 'app-home-found-editor',
  imports: [
    ImagePickerMultiComponent,
    TextEditorComponent,
    DatePipe
  ],
  templateUrl: './home-found-editor.component.html',
  styleUrl: './home-found-editor.component.scss',
})
export class HomeFoundEditorComponent {
  public animal = input.required<CmsAnimal>();

  public entries = computed(() => this.animal().HomeFoundEntries.sort((a, b) => {
    if (!a.CreatedAt || !b.CreatedAt) {
      return 0;
    }
    const dateA = new Date(a.CreatedAt);
    const dateB = new Date(b.CreatedAt);

    if (dateA < dateB) {
      return 1;
    }
    if (dateA > dateB) {
      return -1;
    }
    return 0;
  }));

  constructor(private readonly cmsRequestService: CmsRequestService, private cdRef: ChangeDetectorRef) {
  }

  public addEntry() {
    this.animal().HomeFoundEntries.push(createHomeFoundEntry(this.animal().ID));
  }

  public readonly Date = Date;

  public async removeEntry(index: number) {
    const idToDelete = this.animal().HomeFoundEntries[index].ID;
    if (idToDelete) {
      await firstValueFrom(this.cmsRequestService.deleteHomeFoundEntries([idToDelete]));
    }
    this.animal().HomeFoundEntries.splice(index, 1);
    this.cdRef.markForCheck();
  }
}
