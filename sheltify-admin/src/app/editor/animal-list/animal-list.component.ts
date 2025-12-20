import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { createNewAnimal } from 'src/app/cms-types/cms-type.factory';
import { CmsAnimal } from 'src/app/cms-types/cms-types';
import { TextInputModalComponent } from 'src/app/forms/text-input-modal/text-input-modal.component';
import { TextInputComponent } from 'src/app/forms/text-input/text-input.component';
import { AnimalService } from 'src/app/services/animal.service';
import { ModalService } from 'src/app/services/modal.service';
import { CmsImageDirective } from 'src/app/ui/cms-image.directive';
import { AnimalEditorComponent } from '../../editor/animal-editor/animal-editor.component';
import { CmsRequestService } from '../../services/cms-request.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-animal-list',
  imports: [
    DatePipe,
    AnimalEditorComponent,
    CmsImageDirective,
    TextInputComponent,
  ],
  templateUrl: './animal-list.component.html',
  styleUrl: './animal-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnimalListComponent implements OnInit {
  private cmsRequestService = inject(CmsRequestService);

  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);


  editedAnimals = signal(new Map<string, CmsAnimal>([]));

  selectedAnimal = signal<CmsAnimal | null>(null);

  search = signal('');

  constructor(private modalService: ModalService, protected animalService: AnimalService) {
  }

  public animalList = computed(() => {
    return this.animalService.animals().filter(animal => animal.Name?.toLowerCase().includes(this.search().toLowerCase()));
  })

  ngOnInit() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');

    if(id != null) {
      this.toAnimal(id);
    }
  }

  async toAnimal(id: string) {
    const animal = await firstValueFrom(this.cmsRequestService.getAnimal(id));
    this.selectedAnimal.set(animal);

    this.router.navigate(['/tiere', id]);
  }

  public async newAnimal() {
    const name = await this.modalService.openFinishable(TextInputModalComponent, {
      label: "Name eingeben"
    });
    if(!name) return;
    // TODO most data should be undefined at start
    const animal = createNewAnimal(name);

    const savedAnimal = await firstValueFrom(this.cmsRequestService.saveAnimal(animal));
    this.animalService.reloadAnimals();
    this.selectedAnimal.set(savedAnimal);
    this.router.navigate(['/tiere', savedAnimal.ID]);
  }

  public onSavedAnimal(animal: CmsAnimal | null) {
    if (animal) {
      //TODO wenn deployed: gucken ob das wirklich sinnvoll ist oder ob ein einfacher reload besser wäre.
      // structurecClone hier sinnvoll? Wenns fehlt wird liste bei jeder änderung geupdated, auch wenn nicht gespeichert wurde...
      this.editedAnimals.update(map => map.set(animal.ID!, structuredClone(animal)));
      this.selectedAnimal.set(animal);
      this.animalService.reloadAnimals();
    }
  }

  protected onDeletedAnimal() {
    this.selectedAnimal.set(null);
    this.animalService.reloadAnimals();
  }
}
