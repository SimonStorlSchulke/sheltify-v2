import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, model, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, ActivatedRouteSnapshot, ResolveFn, Router, Routes } from '@angular/router';
import { DashboardComponent } from '@app/pages/dashboard/dashboard.component';
import { LoginComponent } from '@app/pages/login/login.component';
import { AuthGuard } from '@app/services/auth-guard.service';
import { firstValueFrom } from 'rxjs';
import { CmsAnimal } from 'sheltify-lib/cms-types';
import { createNewAnimal } from '@app/cms-types/cms-type.factory';
import { RadioButtonsInputComponent } from '@app/forms/radio-buttons-input/radio-buttons-input.component';
import { TextInputModalComponent } from '@app/forms/text-input-modal/text-input-modal.component';
import { TextInputComponent } from '@app/forms/text-input/text-input.component';
import { LeftSidebarLayoutComponent } from '@app/layout/left-sidebar-layout/left-sidebar-layout.component';
import { AnimalService } from '@app/services/animal.service';
import { ModalService } from '@app/services/modal.service';
import { TenantConfigurationService } from '@app/services/tenant-configuration.service';
import { BtIconComponent } from '@app/ui/bt-icon/bt-icon.component';
import { CmsImageDirective } from '@app/ui/cms-image.directive';
import { AnimalEditorComponent } from '../../editor/animal-editor/animal-editor.component';
import { CmsRequestService } from '../../services/cms-request.service';

export const animalResolver: ResolveFn<CmsAnimal> = (route: ActivatedRouteSnapshot) => {
  const id = route.paramMap.get('id')!;
  return inject(CmsRequestService).getAnimal(id);
}


@Component({
  selector: 'app-animal-list',
  imports: [
    DatePipe,
    AnimalEditorComponent,
    CmsImageDirective,
    TextInputComponent,
    BtIconComponent,
    LeftSidebarLayoutComponent,
    RadioButtonsInputComponent,
  ],
  templateUrl: './animal-list.component.html',
  styleUrl: './animal-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnimalListComponent {
  animalService = inject(AnimalService);
  private cmsRequestService = inject(CmsRequestService);
  private modalService = inject(ModalService);
  private tenantConfigurationService = inject(TenantConfigurationService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

  editedAnimals = signal(new Map<string, CmsAnimal>([]));
  selectedAnimal = signal<CmsAnimal | null>(null);

  animalsWithSameArticle = computed(() => {
    return this.animalService.animalsByArticleID()[this.selectedAnimal()?.ArticleID ?? ''] ?? []
  })

  pageUrl = computed(() => {
    let url = this.tenantConfigurationService.config()?.SiteUrl;
    if (!url) return undefined;

    if (!url.endsWith('/')) url += '/';

    const animals = this.animalsWithSameArticle();
    animals.sort((a, b) => a.ID.localeCompare(b.ID));

    if (!animals[0]?.AnimalKind) return undefined;

    return url + 'tierartikel/' + animals.map(animal => animal.Name).join('-');
  })

  search = signal('');

  animalKinds = signal<string[]>(['alle']);
  selectedAnimalKind = model<string>('alle');

  constructor() {
    this.tenantConfigurationService.animalKinds().then(animalKinds => this.animalKinds.set(['alle', ...animalKinds]));
    this.activatedRoute.data.pipe(takeUntilDestroyed()).subscribe(({animal}) => this.selectedAnimal.set(animal));
  }

  animalList = computed(() => {
    return this.animalService.animals().filter(animal => {
      const matchesSearch = animal.Name?.toLowerCase().includes(this.search().toLowerCase());
      const matchesAnimalKind = this.selectedAnimalKind() == 'alle' || this.selectedAnimalKind() == animal.AnimalKind;
      return matchesSearch && matchesAnimalKind;
    });
  })

  async toAnimal(id: string) {
    await this.router.navigate(['tiere', id]);
  }

  async newAnimal() {

    const name = await this.modalService.openFinishable(TextInputModalComponent, {
      label: "Name eingeben"
    });
    if(!name) return;
    const animalKinds = this.animalKinds();

    const useDefaultAnimalKind = animalKinds.length == 1;

    const animal = createNewAnimal(name, useDefaultAnimalKind ? animalKinds[0] : undefined);

    const savedAnimal = await firstValueFrom(this.cmsRequestService.saveAnimal(animal));
    await this.animalService.reloadAnimals();
    this.selectedAnimal.set(savedAnimal);
    await this.toAnimal(savedAnimal.ID);
  }

  onSavedAnimal(animal: CmsAnimal | null) {
    if (animal) {
      //TODO wenn deployed: gucken ob das wirklich sinnvoll ist oder ob ein einfacher reload besser wäre.
      // structurecClone hier sinnvoll? Wenns fehlt wird liste bei jeder änderung geupdated, auch wenn nicht gespeichert wurde...
      this.editedAnimals.update(map => map.set(animal.ID!, structuredClone(animal)));
      this.animalService.reloadAnimals();
    }
  }

  onDeletedAnimal() {
    this.selectedAnimal.set(null);
    this.animalService.reloadAnimals();
  }
}
