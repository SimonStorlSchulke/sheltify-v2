import { Component, input, inject, model, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { lastValueFrom } from 'rxjs';
import { CmsAnimal } from 'src/app/cms-types/cms-types';
import { CheckboxInputComponent } from 'src/app/forms/checkbox-input/checkbox-input.component';
import { ImagePickerSingleComponent } from 'src/app/forms/image-picker-single/image-picker-single.component';
import { TextInputComponent } from '../../forms/text-input/text-input.component';
import { CmsRequestService } from '../../services/cms-request.service';

@Component({
  selector: 'app-animal-editor',
  imports: [
    TextInputComponent,
    FormsModule,
    CheckboxInputComponent,
    ImagePickerSingleComponent,
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


    const savedAnimal = await lastValueFrom(this.cmsRequestService.saveAnimal(this.animal()!))
    this.saved.emit(savedAnimal);
  }

}
