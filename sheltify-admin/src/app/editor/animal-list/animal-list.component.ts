import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, model, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { CmsAnimal } from 'sheltify-lib/cms-types';
import { createNewAnimal } from 'src/app/cms-types/cms-type.factory';
import { RadioButtonsInputComponent } from 'src/app/forms/radio-buttons-input/radio-buttons-input.component';
import { TextInputModalComponent } from 'src/app/forms/text-input-modal/text-input-modal.component';
import { TextInputComponent } from 'src/app/forms/text-input/text-input.component';
import { LeftSidebarLayoutComponent } from 'src/app/layout/left-sidebar-layout/left-sidebar-layout.component';
import { AnimalService } from 'src/app/services/animal.service';
import { ModalService } from 'src/app/services/modal.service';
import { TenantConfigurationService } from 'src/app/services/tenant-configuration.service';
import { BtIconComponent } from 'src/app/ui/bt-icon/bt-icon.component';
import { CmsImageDirective } from 'src/app/ui/cms-image.directive';
import { AnimalEditorComponent } from '../../editor/animal-editor/animal-editor.component';
import { CmsRequestService } from '../../services/cms-request.service';

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
  private cmsRequestService = inject(CmsRequestService);

  public editedAnimals = signal(new Map<string, CmsAnimal>([]));

  public selectedAnimal = signal<CmsAnimal | null>(null);

  public animalsWithSameArticle = computed(() => {
    return this.animalService.animalsByArticleID()[this.selectedAnimal()?.ArticleID ?? ''] ?? []
  })

  public pageUrl = computed(() => {
    let url = this.tenantConfigurationService.config()?.SiteUrl;
    if (!url) return undefined;

    if (!url.endsWith('/')) url += '/';

    const animals = this.animalsWithSameArticle();
    animals.sort((a, b) => a.ID.localeCompare(b.ID));

    if (!animals[0]?.AnimalKind) return undefined;

    return url + 'tierartikel/' + animals.map(animal => animal.Name).join('-');
  })

  public search = signal('');

  public animalKinds = signal<string[]>(['alle']);
  public selectedAnimalKind = model<string>('alle');

  animalService = inject(AnimalService);
  private modalService = inject(ModalService);
  private tenantConfigurationService = inject(TenantConfigurationService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

  constructor(
  ) {
    this.tenantConfigurationService.animalKinds().then(animalKinds => this.animalKinds.set(['alle', ...animalKinds]));

    this.activatedRoute.data.pipe(takeUntilDestroyed())
      .subscribe(({animal}) => this.selectedAnimal.set(animal));
  }

  public animalList = computed(() => {
    return this.animalService.animals().filter(animal => {
      const matchesSearch = animal.Name?.toLowerCase().includes(this.search().toLowerCase());
      const matchesAnimalKind = this.selectedAnimalKind() == 'alle' || this.selectedAnimalKind() == animal.AnimalKind;
      return matchesSearch && matchesAnimalKind;
    });
  })

  public async toAnimal(id: string) {
    await this.router.navigate(['tiere', id]);
  }

  public async newAnimal() {

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

  public onSavedAnimal(animal: CmsAnimal | null) {
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
