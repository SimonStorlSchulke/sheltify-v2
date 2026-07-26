import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, inject, model, ModelSignal, OnInit, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TagsManagerComponent } from '@app/editor/tags-manager/tags-manager.component';
import { TextInputComponent } from '@app/forms/text-input/text-input.component';
import { LoaderService } from '@app/layout/loader/loader.service';
import { AlertService } from '@app/services/alert.service';
import { AnimalService } from '@app/services/animal.service';
import { CmsRequestService } from '@app/services/cms-request.service';
import { ImageConverterService } from '@app/services/image-converter.service';
import { FinishableDialog, ModalService } from '@app/services/modal.service';
import { TagsService } from '@app/services/tags.service';
import { CmsImageDirective } from '@app/ui/cms-image.directive';
import { ExplainedButtonComponent } from '@app/ui/explained-button/explained-button.component';
import { TagComponent } from '@app/ui/tag/tag.component';
import { NgOptionComponent, NgSelectComponent } from '@ng-select/ng-select';
import { lastValueFrom } from 'rxjs';
import { CmsImage, CmsImagesSize } from 'sheltify-lib/cms-types';

@Component({
  selector: 'app-image-editor',
  imports: [
    CmsImageDirective,
    DatePipe,
    TagComponent,
    TextInputComponent,
    NgOptionComponent,
    NgSelectComponent,
    FormsModule,
    ExplainedButtonComponent,
  ],
  templateUrl: './image-editor.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './image-editor.component.scss'
})
export class ImageEditorComponent extends FinishableDialog<CmsImage> implements OnInit {
  tagsService = inject(TagsService);
  animalService = inject(AnimalService);
  private cmsRequestSv = inject(CmsRequestService);
  private modalService = inject(ModalService);
  private loaderService = inject(LoaderService);
  private imageConverterService = inject(ImageConverterService);
  private alertService = inject(AlertService);

  openedAsModalImage?: CmsImage;
  image = model<CmsImage>() as ModelSignal<CmsImage>; //Workaround for modalService manually setting image
  selectedTags = signal<string[]>([]);
  selectedAnimals = signal<string[]>([]);

  editedImage = output<CmsImage>();

  editFocusMode = false;

  constructor() {
    super();
    effect(() => {
      const img = this.image();
      if (this.image()) {
        this.selectedTags.set(img.MediaTags.map(tag => tag.ID));
        this.selectedAnimals.set(img.TaggedAnimals.map(animal => animal.Name));
      }
    });
  }

  async ngOnInit() {
    await this.setModalImage();
    this.selectedTags.set(this.image().MediaTags.map(tag => tag.ID));
  }

  private async setModalImage() {
    if (this.openedAsModalImage) {
      this.image.set(this.openedAsModalImage);
      await this.tagsService.updateAvailableTags();
      await this.updateMedia();
    }
  }

  async save() {
    await this.updateMedia();
    if (this.isModal) {
      this.finishWith(this.image());
    }
  }

  async updateMedia() {
    const img = this.image();
    img.MediaTags = this.tagsService.availableTags().filter(tag => this.selectedTags().includes(tag.ID));
    img.TaggedAnimals = this.animalService.animals().filter(animal => this.selectedAnimals().includes(animal.Name));
    const editedImage = await this.cmsRequestSv.updateMedia(img);
    if (editedImage) {
      this.editedImage.emit(editedImage)
    }
  }

  editFocusPoint() {
    this.editFocusMode = true;
  }

  setFocusPoint(event: MouseEvent) {
    if (!this.editFocusMode) return;
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    this.editFocusMode = false;
    this.image().FocusX = x;
    this.image().FocusY = y;
  }

  getSizeString(size: CmsImagesSize): string {
    return new Map<CmsImagesSize, string>([
      ['thumbnail', 'winzig'],
      ['small', 'klein'],
      ['medium', 'mittel'],
      ['large', 'groß'],
      ['xlarge', 'extragroß'],
    ]).get(size)!;
  }

  async editTags() {
    await this.updateMedia(); //Workaround for selectedTags resetting to the medias tags when the availableTags are updated
    this.modalService.open(TagsManagerComponent)
  }

  async replaceImage() {
    const answer = await this.alertService.openAlert('Bild wirklich ersetzen?', 'Das Bild wird dann an ALLEN Stellen, an denen es auftaucht durch ein anderes ersetzt.', ['abbrechen', 'ok'])
    if(answer != 'ok') {
      return;
    }

    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.multiple = true;
    fileInput.click();
    fileInput.onchange = () => this.onFilesDropped(fileInput.files!);
  }

  async onFilesDropped(files: FileList) {
    this.loaderService.setLoading('Bilder hochladen...');
    const imageTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/svg"]);

    if(imageTypes.has(files[0].type)) {
      const scaledImages = await this.imageConverterService.generateAllSizes(files[0]);
      const img = await lastValueFrom(this.cmsRequestSv.replaceScaledImage(scaledImages, this.image().ID));
      this.editedImage.emit(img);
    } else {
      this.alertService.openAlert("Falsches Dateiformat", "Nur JPG, PNG, WEBP und SVG Bilder werden unterstützt");
    }
    this.loaderService.unsetLoading('Bilder hochladen...');
  }
}
