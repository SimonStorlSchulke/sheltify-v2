import { Component, input, inject, model, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { CmsAnimal } from 'src/app/cms-types/cms-types';
import { ArticleEditorComponent } from 'src/app/editor/article-editor/article-editor.component';
import { CheckboxInputComponent } from 'src/app/forms/checkbox-input/checkbox-input.component';
import { DatePickerComponent } from 'src/app/forms/date-picker/date-picker.component';
import { ImagePickerSingleComponent } from 'src/app/forms/image-picker-single/image-picker-single.component';
import { randomColor } from 'src/app/services/color-utils';
import { TextInputComponent } from '../../forms/text-input/text-input.component';
import { CmsRequestService } from '../../services/cms-request.service';

@Component({
  selector: 'app-animal-editor',
  imports: [
    TextInputComponent,
    FormsModule,
    CheckboxInputComponent,
    ImagePickerSingleComponent,
    ArticleEditorComponent,
    DatePickerComponent,
  ],
  templateUrl: './animal-editor.component.html',
  styleUrl: './animal-editor.component.scss'
})
export class AnimalEditorComponent {

  private cmsRequestService = inject(CmsRequestService);

  animalId = input<string>("0");
  newAnimalMode = input<boolean>(false);
  animal = input<CmsAnimal | null>(null);
  saved = output<CmsAnimal | null>();

  async save() {
    if (!this.animal()) {
      return;
    }

    // if the animal is new, we create a matching mediaTag for it and assign the portrait to it.
    if(!(this.animal()!.ID)) {
      const tag = await firstValueFrom(this.cmsRequestService.createTag({
        Color: randomColor(30),
        Name: "tier-" + this.animal()!.Name,
      }));

      const portrait = this.animal()!.Portrait;
      if(portrait && portrait.MediaTags.findIndex(cTag => cTag.ID == tag.ID) == -1) {
        portrait.MediaTags.push(tag);
        await this.cmsRequestService.updateMedia(portrait);
      }
    }

    const savedAnimal = await lastValueFrom(this.cmsRequestService.saveAnimal(this.animal()!))
    this.saved.emit(savedAnimal);
  }

  protected setArticleId(id: number) {
    this.animal()!.ArticleID = id;
    this.save();
  }
}
