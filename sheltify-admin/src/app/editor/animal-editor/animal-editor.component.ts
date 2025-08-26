import { Component, input, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { lastValueFrom } from 'rxjs';
import { CmsAnimal } from 'src/app/cms-types/cms-types';
import { CheckboxInputComponent } from 'src/app/forms/checkbox-input/checkbox-input.component';
import { TextInputComponent } from '../../forms/text-input/text-input.component';
import { CmsRequestService } from '../../services/cms-request.service';

@Component({
    selector: 'app-animal-editor',
  imports: [
    TextInputComponent,
    FormsModule,
    CheckboxInputComponent,
  ],
    templateUrl: './animal-editor.component.html',
    styleUrl: './animal-editor.component.scss'
})
export class AnimalEditorComponent {

  private cmsRequestService = inject(CmsRequestService);

  animalId = input<string>("0");
  newAnimalMode = input<boolean>(false);
  animal = input<CmsAnimal | null>(null);

  async save() {
    console.log(this.animal());
    if(!this.animal()) {
      return;
    }

    if(this.animal()!.ID) {
      await lastValueFrom(this.cmsRequestService.updateAnimal(this.animal()!))
    } else {
      await lastValueFrom(this.cmsRequestService.createAnimal(this.animal()!))
    }
  }

}
