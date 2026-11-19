import { Component, computed, inject, model, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { createNewAnimal } from '@app/cms-types/cms-type.factory';
import { CheckboxInputComponent } from '@app/forms/checkbox-input/checkbox-input.component';
import { ImagePickerSingleComponent } from '@app/forms/image-picker-single/image-picker-single.component';
import { NumberInputComponent } from '@app/forms/number-input/number-input.component';
import { RadioButtonsInputComponent } from '@app/forms/radio-buttons-input/radio-buttons-input.component';
import { TextInputModalComponent } from '@app/forms/text-input-modal/text-input-modal.component';
import { TextInputComponent } from '@app/forms/text-input/text-input.component';
import { AnimalService } from '@app/services/animal.service';
import { AskSaveService } from '@app/services/ask-save.service';
import { CmsRequestService } from '@app/services/cms-request.service';
import { ModalService } from '@app/services/modal.service';
import { TenantConfigurationService } from '@app/services/tenant-configuration.service';
import { BtIconComponent } from '@app/ui/bt-icon/bt-icon.component';
import { firstValueFrom } from 'rxjs';
import { CmsAnimal } from 'sheltify-lib/dist/cms-types';

@Component({
  selector: 'app-animal-table',
  imports: [
    CheckboxInputComponent,
    RadioButtonsInputComponent,
    ImagePickerSingleComponent,
    RouterLink,
    TextInputComponent,
    BtIconComponent,
    NumberInputComponent
  ],
  templateUrl: './animal-table.component.html',
  styleUrl: './animal-table.component.scss',
})
export class AnimalTableComponent implements OnInit {
  private animalService = inject(AnimalService);
  private tenantConfigurationService = inject(TenantConfigurationService);
  protected askSaveService = inject(AskSaveService);
  protected modalService = inject(ModalService);
  protected cmsRequestService = inject(CmsRequestService);

  search = signal('');

  animalKinds = signal<string[]>(['alle']);
  selectedAnimalKind = model<string>('alle');

  animalStati = signal<string[]>([]);

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
    this.askSaveService.triggerSave$.pipe(takeUntilDestroyed()).subscribe((ids) => this.saveOnReroute(ids));
  }

  async ngOnInit() {
    this.animalStati.set(await this.tenantConfigurationService.animalStati())
    this.animalKinds.set(await this.tenantConfigurationService.animalKinds());
  }

  setStatus(animal: CmsAnimal, status: string, active: boolean) {
    this.setDirty(animal);
    this.animalService.setStatus(animal, status, active, this.animalStati())
  }

  async editDescription(animal: CmsAnimal) {
    this.setDirty(animal);
    animal.Description = await this.modalService.openFinishable(TextInputModalComponent, {
      label: "Beschreibung eingeben",
      presetText: animal.Description,
      long: true,
    }, 'modal-lg', true) ?? animal.Description;
  }


  setDirty(animal: CmsAnimal) {
    this.askSaveService.markDirty(animal.ID);
  }

  async saveEditedAnimals() {
    const unsavedAnimals = this.animalList().filter(animal => this.askSaveService.getDirtyIds().has(animal.ID));
    await this.saveAnimals(unsavedAnimals);
  }

  private async saveOnReroute(ids: string[]) {
    const unsavedAnimals = this.animalList().filter(animal => ids.includes(animal.ID));
    await this.saveAnimals(unsavedAnimals);
  }

  private async saveAnimals(unsavedAnimals: CmsAnimal[]) {
    for (const unsavedAnimal of unsavedAnimals) {
      try {
        await this.animalService.save(unsavedAnimal, false);
        this.askSaveService.cleanId(unsavedAnimal.ID);
      } catch (error) {
        console.error(error);
      }
    }
  }


  async newAnimal() {

    const name = await this.modalService.openFinishable(TextInputModalComponent, {
      label: "Name eingeben"
    });
    if(!name) return;

    const useDefaultAnimalKind = await this.tenantConfigurationService.useDefaultAnimalKind();

    const animal = createNewAnimal(name, useDefaultAnimalKind);

    await firstValueFrom(this.cmsRequestService.saveAnimal(animal));
    await this.animalService.reloadAnimals();
  }
}
