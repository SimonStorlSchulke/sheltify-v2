import { computed, Service, signal, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { CmsAnimal, SqlNullTimeNow, SqlNullTimeNull } from 'sheltify-lib/cms-types';
import { CmsRequestService } from '@app/services/cms-request.service';

@Service()
export class AnimalService {
  private cmsRequestService = inject(CmsRequestService);

  constructor() {
    this.reloadAnimals();
  }

  animals = signal<CmsAnimal[]>([]);

  animalsByArticleID = computed(() => {
    return this.animals().reduce((acc, animal) => {
      animal.ArticleID ??= 'NoArticle'
      acc[animal.ArticleID] = acc[animal.ArticleID] ?? [];
      acc[animal.ArticleID].push(animal);
      return acc;
    }, {} as Record<string, CmsAnimal[]>);
  })

  async reloadAnimals() {
    const animals = await firstValueFrom(this.cmsRequestService.getAnimals());
    this.animals.set(animals.results ?? []);
  }

  async togglePublished(animalToSave: CmsAnimal) {
    if(animalToSave.PublishedAt?.Valid) {
      animalToSave.PublishedAt = SqlNullTimeNull();
      return await this.save(animalToSave);
    } else {
      animalToSave.PublishedAt = SqlNullTimeNow();
      try {
        return await this.save(animalToSave);
      } catch {
        animalToSave.PublishedAt = SqlNullTimeNull();
        return animalToSave;
      }
    }
  }

  isPublished(animal: CmsAnimal): boolean {
    return !!animal.PublishedAt?.Valid && !!animal.ArticleID && animal.ArticleID != 'NoArticle'
  }

  setStatus(animal: CmsAnimal, status: string, active: boolean, animalStati: string[]) {
    let currentStati = animal.Status?.split(',') ?? []
    currentStati = currentStati.filter(status => animalStati.includes(status));
    const stati = new Set(currentStati);
    active ? stati.add(status) : stati.delete(status);
    animal.Status = [...stati].join(',');
    console.log(animal.Status)
  }

  async save(animal: CmsAnimal) {
    if (!animal) {
      console.log("animal is null or undefined");
      return;
    }

    const savedAnimal = await firstValueFrom(this.cmsRequestService.saveAnimal(animal!));
    console.log("saved animal", savedAnimal);
    return savedAnimal;
  }
}
