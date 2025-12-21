import { AsyncPipe } from '@angular/common';
import { Component, computed, OnInit, output, Pipe, PipeTransform, Signal, signal } from '@angular/core';
import { lastValueFrom, map, Observable, Subject } from 'rxjs';
import { CmsAnimal, CmsImage, CmsTag } from 'sheltify-lib/cms-types';
import { LoaderService } from 'src/app/layout/loader/loader.service';
import { FileDropDirective } from 'src/app/media-library/file-drop.directive';
import { ImageEditorComponent } from 'src/app/media-library/image-editor/image-editor.component';
import { MediaEntryComponent } from 'src/app/media-library/media-entry/media-entry.component';
import { AnimalService } from 'src/app/services/animal.service';
import { AuthService } from 'src/app/services/auth.service';
import { CmsRequestService } from 'src/app/services/cms-request.service';
import { ImageConverterService } from 'src/app/services/image-converter.service';
import { FinishableDialog } from 'src/app/services/modal.service';
import { TagsService } from 'src/app/services/tags.service';
import { TagComponent } from 'src/app/ui/tag/tag.component';
import { NgOptionComponent, NgSelectComponent } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';

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
  styleUrl: './media-library.component.scss'
})
export class MediaLibraryComponent extends FinishableDialog<CmsImage[]> implements OnInit {
  public selectedTags = signal<string[]>([]);
  public selectedAnimals = signal<CmsAnimal[]>([]);
  public activeImageId = signal<string>("");
  public selectedImageIds = signal(new Set<string>());
  public filesHovered = signal<boolean>(false);

  private refreshImages = signal(0);

  public images$: Signal<Observable<CmsImage[]>> = computed(() => {
    const tenant = this.authSv.getTenantID();
    const selectedTags = this.selectedTags()
    const selectedAnimals = this.selectedAnimals()
    this.refreshImages();


    if(selectedAnimals.length > 0) {
      const animalIds = selectedAnimals.map(animal => animal.ID);
      return this.cmsRequestSv.getMediaByAnimalIDs(animalIds, tenant).pipe(
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

  public editedImages = signal(new Map<string, CmsImage>([]));

  public pickedImages = output<string[]>();

  constructor(
    private loaderSv: LoaderService,
    private cmsRequestSv: CmsRequestService,
    private authSv: AuthService,
    private imageConverterSv: ImageConverterService,
    public tagsService: TagsService,
    public animalService: AnimalService,
  ) {
    super();
  }


  async ngOnInit() {
    this.tagsService.updateAvailableTags();
  }

  public toggleSelect(id: string, e: MouseEvent, currentImageList: CmsImage[]) {
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

  public async uploadImages() {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.multiple = true;
    fileInput.click();
    fileInput.onchange = () => this.onFilesDropped(fileInput.files!);
  }

  public async onFilesDropped(files: FileList) {
    this.loaderSv.setLoading('Bilder hochladen...');
    for (let i = 0; i < files.length; i++) {
      const scaledImages = await this.imageConverterSv.generateAllSizes(files[i]);

      const tags = this.tagsService.availableTags().filter(tag => this.selectedTags().includes(tag.ID)).map(tag => tag.Name);

      const animalIds = this.selectedAnimals().map(animal => animal.ID);

      await lastValueFrom(this.cmsRequestSv.uploadScaledImage(scaledImages, files[i].name, tags.join(","), animalIds.join(",")));

    }
    this.refreshImages.update((i) => i + 1);
    this.loaderSv.unsetLoading('Bilder hochladen...');
  }

  onFilesHovered($event: boolean) {
    this.filesHovered.set($event);
  }

  public async deleteSelectedImages() {
    for (const argument of this.selectedImageIds()) {
      await lastValueFrom(this.cmsRequestSv.deleteImage(argument));
    }
    this.refreshImages.update((i) => i + 1);
  }


  addEditedImage(image: CmsImage) {
    this.editedImages.update(map => map.set(image.ID, image));
  }

  onTagAdded(tag: CmsTag, image: CmsImage) {
    this.tagsService.availableTags.update(tags => [...tags, tag])
    image.MediaTags.push(tag)
  }

  pickImages(selectedIds: Set<string>, images: CmsImage[]) {
    // TODO: Auch aktuell NICHT angezeigte Bilder auswählbar machen?
    const selectedImages = Array.from(images).filter(img => selectedIds.has(img.ID));
    this.finishSubject.next(selectedImages)
  }
}

