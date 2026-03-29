import { computed, Injectable, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { CmsAnimal, SqlNullTimeNow } from 'sheltify-lib/cms-types';
import { CmsRequestService } from 'src/app/services/cms-request.service';

@Injectable({
  providedIn: 'root',
})
export class AnimalService {
  constructor(private cmsRequestService: CmsRequestService) {
    this.reloadAnimals();
  }

  public animals = signal<CmsAnimal[]>([]);

  public animalsByArticleID = computed(() => {
    return this.animals().reduce((acc, animal) => {
      animal.ArticleID ??= 'NoArticle'
      acc[animal.ArticleID] = acc[animal.ArticleID] ?? [];
      acc[animal.ArticleID].push(animal);
      return acc;
    }, {} as Record<string, CmsAnimal[]>);
  })

  public async reloadAnimals() {
    const animals = await firstValueFrom(this.cmsRequestService.getAnimals());
    this.animals.set(animals.results ?? []);
  }

  async togglePublished(animal: CmsAnimal) {
    const animalToSave = structuredClone(animal);
    if(animalToSave.PublishedAt?.Valid) {
      animalToSave.PublishedAt = {
        Valid: false,
        Time: null,
      };
      return await this.save(animalToSave);
    } else {
      animalToSave.PublishedAt = SqlNullTimeNow();
      return await this.save(animalToSave);
    }

  }

  public isPublished(animal: CmsAnimal): boolean {
    return !!animal.PublishedAt?.Valid && !!animal.ArticleID && animal.ArticleID != 'NoArticle'
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
