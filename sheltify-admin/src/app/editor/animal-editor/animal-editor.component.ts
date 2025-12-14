import { Component, input, inject, output, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { firstValueFrom, Subject } from 'rxjs';
import { CmsArticle } from 'src/app/cms-types/article-types';
import { createEmptyArticle } from 'src/app/cms-types/cms-type.factory';
import { CmsAnimal } from 'src/app/cms-types/cms-types';
import { ArticleEditorComponent } from 'src/app/editor/article-editor/article-editor.component';
import { CheckboxInputComponent } from 'src/app/forms/checkbox-input/checkbox-input.component';
import { DatePickerComponent } from 'src/app/forms/date-picker/date-picker.component';
import { ImagePickerSingleComponent } from 'src/app/forms/image-picker-single/image-picker-single.component';
import { NumberInputComponent } from 'src/app/forms/number-input/number-input.component';
import { RadioButtonsInputComponent } from 'src/app/forms/radio-buttons-input/radio-buttons-input.component';
import { AnimalService } from 'src/app/services/animal.service';
import { ModalService } from 'src/app/services/modal.service';
import { AnimalPickerDialogComponent } from 'src/app/ui/animal-picker-dialog/animal-picker-dialog.component';
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
    RadioButtonsInputComponent,
    NumberInputComponent,
  ],
  templateUrl: './animal-editor.component.html',
  styleUrl: './animal-editor.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnimalEditorComponent {

  private cmsRequestService = inject(CmsRequestService);

  animal = input<CmsAnimal | null>(null);
  animals = input.required<CmsAnimal[] | null>();
  saved = output<CmsAnimal | null>();

  saveArticle$ = new Subject<void>();

  constructor(private modalService: ModalService, private readonly animalService: AnimalService) {
  }

  async save() {
    const savedAnimal = await this.animalService.save(this.animal()!);

    if(savedAnimal) {
      this.saved.emit(savedAnimal!);
      this.saveArticle$.next();
    }
  }

  async togglePublished() {
    const savedAnimal = await this.animalService.togglePublishedAnimal(this.animal()!);

    if(savedAnimal) {
      this.saved.emit(savedAnimal!);
      this.saveArticle$.next();
    }
  }

  protected async createArticle() {
    const article: CmsArticle = createEmptyArticle();
    const savedArticle = await firstValueFrom(this.cmsRequestService.saveArticle(article));
    this.animal()!.ArticleID = savedArticle.ID;
    this.save();
  }

  protected async assignExistingArticle() {
    const selectedAnimal = await this.modalService.openFinishable(AnimalPickerDialogComponent, {
      animals: this.animals()!
    });

    if(selectedAnimal) {
      this.animal()!.ArticleID = selectedAnimal.ArticleID;
      this.save();
    }
  }
}
