import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, computed, inject, OnInit, output, Pipe, PipeTransform, Signal, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LoaderService } from '@app/layout/loader/loader.service';
import { FileDropDirective } from '@app/media-library/file-drop.directive';
import { ImageEditorComponent } from '@app/media-library/image-editor/image-editor.component';
import { MediaEntryComponent } from '@app/media-library/media-entry/media-entry.component';
import { UnusedMediafilesComponent } from '@app/media-library/unused-mediafiles/unused-mediafiles.component';
import { AlertService } from '@app/services/alert.service';
import { AnimalService } from '@app/services/animal.service';
import { AuthService } from '@app/services/auth.service';
import { CmsRequestService } from '@app/services/cms-request.service';
import { ImageConverterService } from '@app/services/image-converter.service';
import { FinishableDialog, ModalService } from '@app/services/modal.service';
import { TagsService } from '@app/services/tags.service';
import { TagComponent } from '@app/ui/tag/tag.component';
import { NgOptionComponent, NgSelectComponent } from '@ng-select/ng-select';
import { lastValueFrom, map, Observable } from 'rxjs';
import { CmsAnimal, CmsImage } from 'sheltify-lib/cms-types';

@Pipe({name: "mediaSelection", pure: true})
class MediaSelectionPipe implements PipeTransform {
  transform(value: { images: CmsImage[], selected: Set<string>, active: string }, ...args: any[]) {
    return {
      active: value.images.find(i => i.ID == value.active),
      selected: value.images.filter(i => value.selected.has(i.ID!)),
    }
  }
}

@Component({
  selector: 'app-media-library',
  imports: [
    AsyncPipe,
    MediaEntryComponent,
    NgSelectComponent,
    FormsModule,
    MediaSelectionPipe,
    NgOptionComponent,
    TagComponent,
    FileDropDirective,
    ImageEditorComponent,
  ],
  templateUrl: './media-library.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './media-library.component.scss'
})
export class MediaLibraryComponent extends FinishableDialog<CmsImage[]> implements OnInit {
  private loaderService = inject(LoaderService);
  private cmsRequestSv = inject(CmsRequestService);
  private authSv = inject(AuthService);
  private imageConverterService = inject(ImageConverterService);
  tagsService = inject(TagsService);
  animalService = inject(AnimalService);
  private modalService = inject(ModalService);
  private alertService = inject(AlertService);
  private cdRef = inject(ChangeDetectorRef);

  selectedTags = signal<string[]>([]);
  selectedAnimals = signal<CmsAnimal[]>([]);
  activeImageId = signal<string>("");
  selectedImageIds = signal(new Set<string>());
  filesHovered = signal<boolean>(false);

  isPicker = false;
  preselectedImage?: CmsImage;

  private refreshImages = signal(0);

  images$: Signal<Observable<CmsImage[]>> = computed(() => {
    const tenant = this.authSv.getTenantID();
    const selectedTags = this.selectedTags()
    const selectedAnimals = this.selectedAnimals()
    this.refreshImages();


    if(selectedAnimals.length > 0) {
      const animalIds = selectedAnimals.map(animal => animal.ID);
      return this.cmsRequestSv.getMediaByAnimalIDs(animalIds).pipe(
        map(images => images.sort((a, b) => {
          if (a.Title == b.Title) return a.ID < b.ID ? -1 : 1
          else return a.Title < b.Title ? -1 : 1
        })),
      );
    }

    const tags = this.tagsService.availableTags()
      .filter(tag => selectedTags.includes(tag.ID))
      .map(tag => tag.Name);

    return this.cmsRequestSv.getMediaByTags(tags, tenant).pipe(
      map(images => images.sort((a, b) => {
        if (a.Title == b.Title) return a.ID < b.ID ? -1 : 1
        else return a.Title < b.Title ? -1 : 1
      })),
    );
  });

  async ngOnInit() {
    this.setPreselectedImage();
    await this.checkUnusedMediaFilesOnceAWeek();
    this.tagsService.updateAvailableTags();
  }

  private setPreselectedImage() {
    if (this.preselectedImage) {
      this.selectedImageIds().add(this.preselectedImage!.ID)
      this.activeImageId.set(this.preselectedImage!.ID)
    }
  }

  async getUnusedMediaFiles(): Promise<CmsImage[]> {
    return await this.cmsRequestSv.getUnlinkedMediaFiles();
  }

  async getOldUnusedMediaFiles(): Promise<CmsImage[]> {
    let unlinkedMediaFiles = await this.cmsRequestSv.getUnlinkedMediaFiles();
    return unlinkedMediaFiles.filter(mediaFile => {
      const diffMs = Date.now() - new Date(mediaFile.CreatedAt as any).getTime();
      const minutes = diffMs / 60000;
      const hours = minutes / 60;
      const days = hours / 24;
      return days > 7
    });
  }

  async openUnusedMediaDeleter() {
    await this.modalService.openFinishable(UnusedMediafilesComponent, {
      unusedMediafiles: this.unusedImages(),
    });
    this.refreshImages.update((i) => i + 1);
  }

  editedImages = signal(new Map<string, CmsImage>([]));

  pickedImages = output<string[]>();

  unusedImages = signal<CmsImage[] | undefined>(undefined);


  private async checkUnusedMediaFilesOnceAWeek() {
    const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;

    const lastCheck = Number(localStorage.getItem('unusedMediaLastCheck'));
    const now = Date.now();

    if (!lastCheck || now - lastCheck > ONE_WEEK_MS) {
      this.unusedImages.set(await this.getOldUnusedMediaFiles());
      localStorage.setItem('unusedMediaLastCheck', String(now));
    }
  }

  async updateUnusedMediaFiles() {
    this.unusedImages.set(await this.getUnusedMediaFiles());
    if(this.unusedImages()!.length > 0) {
      await this.openUnusedMediaDeleter();
    } else {
      this.alertService.openToast('Keine unverwendeten Bilder gefunden', '', 'success')
    }
  }

  toggleSelect(id: string, e: MouseEvent, currentImageList: CmsImage[]) {
    this.selectedImageIds.update(ids => {
      if (e.shiftKey) {
        const allIds = currentImageList.map(i => i.ID);
        const currentImageIndex = allIds.indexOf(id);
        const previousSelectedImageIndex = allIds.indexOf(this.activeImageId())
        const idsToSelect = currentImageIndex > previousSelectedImageIndex ?
          allIds.slice(previousSelectedImageIndex, currentImageIndex + 1)
          : allIds.slice(currentImageIndex, previousSelectedImageIndex + 1);

        return new Set([...ids.values(), ...idsToSelect]);
      }

      if (e.ctrlKey) {
        ids.has(id) ? ids.delete(id) : ids.add(id);
        return ids;
      }
      return new Set([id])
    });

    if (this.selectedImageIds().has(id)) {
      this.activeImageId.set(id);
    } else {
      this.activeImageId.set("")
    }
  }

  async uploadImages() {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.multiple = true;
    fileInput.click();
    fileInput.onchange = () => this.onFilesDropped(fileInput.files!);
  }

  async onFilesDropped(files: FileList) {
    this.loaderService.setLoading('Bilder hochladen...');
    const imageIds = new Set<string>();
    for (const element of files) {
      const imageTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/svg"]);

      const tags = this.tagsService.availableTags().filter(tag => this.selectedTags().includes(tag.ID)).map(tag => tag.Name);
      const animalIds = this.selectedAnimals().map(animal => animal.ID);

      let img: CmsImage;
      if (imageTypes.has(element.type)) {
        const scaledImages = await this.imageConverterService.generateAllSizes(element);
        img = await lastValueFrom(this.cmsRequestSv.uploadScaledImage(scaledImages, element.name, tags.join(","), animalIds.join(",")));
      } else {
        img = await lastValueFrom(this.cmsRequestSv.uploadFiles([element], element.name, tags.join(","), animalIds.join(",")));
      }
      imageIds.add(img.ID);
    }
    this.refreshImages.update((i) => i + 1);
    this.loaderService.unsetLoading('Bilder hochladen...');
    this.selectedImageIds.set(imageIds)
  }

  onFilesHovered($event: boolean) {
    this.filesHovered.set($event);
  }

  async deleteSelectedImages() {
    if(this.unusedImages() === undefined) {
      this.unusedImages.set(await this.getUnusedMediaFiles());
    }

    const unusedSelectedImages = Array.from(this.selectedImageIds())
      .filter(id => this.unusedImages()!.some(img => img.ID == id));

    if(unusedSelectedImages.length !== this.selectedImageIds().size) {
      if(this.selectedImageIds().size == 1) {
        await this.alertService.openAlert("Bild wird noch verwendet", "Dieses Bild wird noch verwendet und kann nicht gelöscht werden")
        return;
      } else if(this.selectedImageIds().size > 1) {
        await this.alertService.openAlert("Bilder werden noch verwendet", "Einige dieser Bilder werden noch verwendet und können nicht gelöscht werden")
      }
    }

    try {
      await lastValueFrom(this.cmsRequestSv.deleteImages(unusedSelectedImages));
    } finally {
      this.refreshImages.update((i) => i + 1);
    }
  }

  addEditedImage(image: CmsImage) {
    this.editedImages.update(map => map.set(image.ID, image));
  }

  pickImages(selectedIds: Set<string>, images: CmsImage[]) {
    // TODO: Auch aktuell NICHT angezeigte Bilder auswählbar machen?
    const selectedImages = Array.from(images).filter(img => selectedIds.has(img.ID));
    this.finishSubject.next(selectedImages);
  }
}

