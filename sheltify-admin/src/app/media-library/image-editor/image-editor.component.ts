import { AsyncPipe, DatePipe } from '@angular/common';
import { Component, effect, input, OnInit, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgOptionComponent, NgSelectComponent } from '@ng-select/ng-select';
import { firstValueFrom } from 'rxjs';
import { CmsAnimal, CmsImage, CmsImagesSize, CmsTag } from 'sheltify-lib/cms-types';
import { TagsManagerComponent } from 'src/app/editor/tags-manager/tags-manager.component';
import { TextInputComponent } from 'src/app/forms/text-input/text-input.component';
import { MediaLibraryComponent } from 'src/app/media-library/media-library.component';
import { AnimalService } from 'src/app/services/animal.service';
import { CmsRequestService } from 'src/app/services/cms-request.service';
import { ModalService } from 'src/app/services/modal.service';
import { TagsService } from 'src/app/services/tags.service';
import { CmsImageDirective } from 'src/app/ui/cms-image.directive';
import { TagComponent } from 'src/app/ui/tag/tag.component';

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
  ],
  templateUrl: './image-editor.component.html',
  styleUrl: './image-editor.component.scss'
})
export class ImageEditorComponent implements OnInit {
  public image = input.required<CmsImage>();
  public selectedTags = signal<string[]>([]);
  public selectedAnimals = signal<string[]>([]);
  public createdTag = output<CmsTag>()

  public editedImage = output<CmsImage>();

  public editFocusMode = false;

  constructor(
    private cmsRequestSv: CmsRequestService,
    private modalService: ModalService,
    public tagsService: TagsService,
    public animalService: AnimalService,
  ) {
    effect(() => {
      const img = this.image();
      if (this.image()) {
        this.selectedTags.set(img.MediaTags.map(tag => tag.ID));
        this.selectedAnimals.set(img.TaggedAnimals.map(animal => animal.Name));
      }
    });
  }

  public ngOnInit() {
    this.selectedTags.set(this.image().MediaTags.map(tag => tag.ID));
  }

  async updateMedia() {
    const img = this.image();
    img.MediaTags = this.tagsService.availableTags().filter(tag => this.selectedTags().includes(tag.ID));
    img.TaggedAnimals = this.animalService.animals().filter(animal => this.selectedAnimals().includes(animal.Name));
    console.log(img);
    console.log(this.animalService.animals());
    console.log(this.selectedAnimals());
    const editedImage = await this.cmsRequestSv.updateMedia(img);
    if (editedImage) {
      this.editedImage.emit(editedImage)
    }
  }

  public editFocusPoint() {
    this.editFocusMode = true;
  }

  public setFocusPoint(event: MouseEvent) {
    if (!this.editFocusMode) return;
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    this.editFocusMode = false;
    this.image().FocusX = x;
    this.image().FocusY = y;
  }

  public getSizeString(size: CmsImagesSize) {
    return new Map<CmsImagesSize, string>([
      ['thumbnail', 'winzig'],
      ['small', 'klein'],
      ['medium', 'mittel'],
      ['large', 'groß'],
      ['xlarge', 'extragroß'],
    ]).get(size);
  }

  public async editTags() {
    await this.updateMedia(); //Workaround for selectedTags resetting to the medias tags when the availableTags are updated
    this.modalService.open(TagsManagerComponent)
  }

  rotateImage(steps: number) {
    this.image().RotationSteps += steps;
  }

}
