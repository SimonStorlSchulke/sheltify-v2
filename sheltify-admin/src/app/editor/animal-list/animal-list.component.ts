import { Component, inject, signal } from '@angular/core';
import { firstValueFrom, lastValueFrom, startWith, Subject, switchMap } from 'rxjs';
import { CmsAnimal } from 'src/app/cms-types/cms-types';
import { CmsImageDirective } from 'src/app/ui/cms-image.directive';
import { AnimalEditorComponent } from '../../editor/animal-editor/animal-editor.component';
import { CmsRequestService } from '../../services/cms-request.service';
import { AsyncPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-animal-list',
  imports: [
    AsyncPipe,
    DatePipe,
    AnimalEditorComponent,
    CmsImageDirective,
  ],
  templateUrl: './animal-list.component.html',
  styleUrl: './animal-list.component.scss'
})
export class AnimalListComponent {
  private cmsRequestService = inject(CmsRequestService);

  private reloadAnimals$ = new Subject<void>();

  $animals = this.reloadAnimals$.pipe(
    startWith(void 0), // trigger initial load
    switchMap(() => this.cmsRequestService.getTenantsAnimals())
  );

  editedAnimals = signal(new Map<number, CmsAnimal>([]));
  public newAnimalMode = false;

  selectedAnimal = signal<CmsAnimal | null>(null)

  async toAnimal(id: number) {
    const animal = await lastValueFrom(this.cmsRequestService.getTenantsAnimal(id));
    this.selectedAnimal.set(animal);
  }

  public newAnimal() {
    this.selectedAnimal.set({
      Birthday: "2018-03-29T15:04:05Z",
      Castrated: false,
      Gender: "male",
      Health: '',
      Patrons: '',
      Priority: 0,
      ShoulderHeightCm: 0,
      Status: 'tierheim',
      TenantID: '',
      WeightKg: 0,
      Name: "Neues Tier",
      Description: ""
    });
  }

  public onSavedAnimal(animal: CmsAnimal | null) {
    if (animal) {
      console.log(animal);
      //TODO wenn deployed: gucken ob das wirklich sinnvoll ist oder ob ein einfacher reload besser wäre.
      // structurecClone hier sinnvoll? Wenns fehlt wird liste bei jeder änderung geupdated, auch wenn nicht gespeichert wurde...
      this.editedAnimals.update(map => map.set(animal.ID!, structuredClone(animal)));
      this.selectedAnimal.set(animal);
      this.reloadAnimals$.next();
    }
  }

  public async deleteAnimals(ids: number[]) {
    await firstValueFrom(this.cmsRequestService.deleteAnimals(ids));
    this.reloadAnimals$.next();
  }
}
