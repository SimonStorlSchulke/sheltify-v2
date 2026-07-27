import { Component, computed, inject, model, signal, twoWayBinding } from '@angular/core';
import { CheckboxInputComponent } from '@app/forms/checkbox-input/checkbox-input.component';
import { ImagePickerSingleComponent } from '@app/forms/image-picker-single/image-picker-single.component';
import { RadioButtonsInputComponent } from '@app/forms/radio-buttons-input/radio-buttons-input.component';
import { AnimalService } from '@app/services/animal.service';
import { AskSaveService } from '@app/services/ask-save.service';
import { TenantConfigurationService } from '@app/services/tenant-configuration.service';
import { CmsAnimal } from 'sheltify-lib/dist/cms-types';

@Component({
  selector: 'app-animal-table',
  imports: [
    CheckboxInputComponent,
    RadioButtonsInputComponent,
    ImagePickerSingleComponent
  ],
  templateUrl: './animal-table.component.html',
  styleUrl: './animal-table.component.scss',
})
export class AnimalTableComponent {
  private animalService = inject(AnimalService);
  private tenantConfigurationService = inject(TenantConfigurationService);
  private askSaveService = inject(AskSaveService);

  search = signal('');

  animalKinds = signal<string[]>(['alle']);
  selectedAnimalKind = model<string>('alle');

  animalStati = signal<string[]>([]);

  async ngOnInit() {
    this.animalStati.set(await this.tenantConfigurationService.animalStati())
    this.animalKinds.set(await this.tenantConfigurationService.animalKinds());
  }

  animalList = computed(() => {
    return this.animalService.animals().filter(animal => {
      const matchesSearch = animal.Name?.toLowerCase().includes(this.search().toLowerCase());
      const matchesAnimalKind = this.selectedAnimalKind() == 'alle' || this.selectedAnimalKind() == animal.AnimalKind;
      return matchesSearch && matchesAnimalKind;
    });
  })

  constructor() {
    this.tenantConfigurationService.animalKinds().then(animalKinds => this.animalKinds.set(['alle', ...animalKinds]));
    this.animalService.reloadAnimals();
  }

  setStatus(animal: CmsAnimal, status: string, active: boolean) {
    this.askSaveService.markDirty();
    this.animalService.setStatus(animal, status, active, this.animalStati())
  }
}
