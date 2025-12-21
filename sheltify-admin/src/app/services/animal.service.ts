import { computed, Injectable, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { CmsAnimal } from 'sheltify-lib/cms-types';
import { CmsRequestService } from 'src/app/services/cms-request.service';
import { randomColor } from 'src/app/services/color-utils';

@Injectable({
  providedIn: 'root',
})
export class AnimalService {
  constructor(private readonly cmsRequestService: CmsRequestService) {
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
      animalToSave.PublishedAt = {
        Valid: true,
        Time: new Date().toISOString(),
      }
      return await this.save(animalToSave);
    }

  }

  async save(animal: CmsAnimal) {
    if (!animal) {
      console.log("animal is null or undefined");
      return;
    }

    // if the animal is new, we create a matching mediaTag for it and assign the portrait to it.
    if(!(animal!.ID)) {
      const tag = await firstValueFrom(this.cmsRequestService.createTag({
        Color: randomColor(30),
        Name: "tier-" + animal!.Name,
      }));

      const portrait = animal!.Portrait;
      if(portrait && portrait.MediaTags.findIndex(cTag => cTag.ID == tag.ID) == -1) {
        portrait.MediaTags.push(tag);
        await this.cmsRequestService.updateMedia(portrait);
      }
    }

    const savedAnimal = await firstValueFrom(this.cmsRequestService.saveAnimal(animal!));
    console.log("saved animal", savedAnimal);
    return savedAnimal;
  }
}
