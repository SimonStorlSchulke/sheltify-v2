import { Component, inject, signal } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { CmsAnimal } from 'src/app/cms-types/cms-types';
import { MediaLibraryComponent } from 'src/app/media-library/media-library.component';
import { ModalService } from 'src/app/services/modal.service';
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
  $animals = this.cmsRequestService.getTenantsAnimals();
  public newAnimalMode = false;
  private modalSv = inject(ModalService);

  selectedAnimal = signal<CmsAnimal | null>(null)

  async toAnimal(id: number) {
    const animal = await lastValueFrom(this.cmsRequestService.getTenantsAnimal(id));
    this.selectedAnimal.set(animal);
  }

  test() {
    this.modalSv.open(MediaLibraryComponent, {}, 'modal-fullscreen')
  }

  newAnimal() {
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
}
