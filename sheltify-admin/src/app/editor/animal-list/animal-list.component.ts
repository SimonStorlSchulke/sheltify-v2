import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  styleUrl: './animal-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnimalListComponent implements OnInit {
  private cmsRequestService = inject(CmsRequestService);

  private reloadAnimals$ = new Subject<void>();

  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);

  $animals = this.reloadAnimals$.pipe(
    startWith(void 0),
    switchMap(() => this.cmsRequestService.getTenantsAnimals())
  );

  editedAnimals = signal(new Map<string, CmsAnimal>([]));
  public newAnimalMode = false;

  selectedAnimal = signal<CmsAnimal | null>(null);

  ngOnInit() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');

    if(id != null) {
      this.toAnimal(id);
    }
  }

  async toAnimal(id: string) {
    const animal = await lastValueFrom(this.cmsRequestService.getTenantsAnimal(id));
    this.selectedAnimal.set(animal);

    this.router.navigate(['/tiere', id]);
  }

  public newAnimal() {
    // TODO most data should be undefined at start
    this.selectedAnimal.set({
      ID: '', //TODO - passt das so?
      Birthday: "2018-03-29T15:04:05Z", //TODO
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
      //TODO wenn deployed: gucken ob das wirklich sinnvoll ist oder ob ein einfacher reload besser wäre.
      // structurecClone hier sinnvoll? Wenns fehlt wird liste bei jeder änderung geupdated, auch wenn nicht gespeichert wurde...
      this.editedAnimals.update(map => map.set(animal.ID!, structuredClone(animal)));
      this.selectedAnimal.set(animal);
      this.reloadAnimals$.next();
    }
  }

  public async deleteAnimals(ids: string[]) {
    await firstValueFrom(this.cmsRequestService.deleteAnimals(ids));
    this.reloadAnimals$.next();
  }
}
