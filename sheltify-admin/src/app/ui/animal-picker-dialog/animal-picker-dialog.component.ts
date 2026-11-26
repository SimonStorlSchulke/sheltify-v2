import { NgTemplateOutlet } from '@angular/common';
import { Component, OnInit, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CmsAnimal } from 'sheltify-lib/cms-types';
import { FinishableDialog } from '@app/services/modal.service';

@Component({
  selector: 'app-animal-picker-dialog',
  imports: [
    NgTemplateOutlet
  ],
  templateUrl: './animal-picker-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './animal-picker-dialog.component.scss',
})
export class AnimalPickerDialogComponent extends FinishableDialog<CmsAnimal> implements OnInit {
  animals: CmsAnimal[] = [];
  byArticle = false;

  animalsByArticleID = signal(new Map<string, { animals: CmsAnimal[], title: string }>());

  search = signal('');
  private normalizedSearch = computed(() => this.search().trim().toLowerCase());

  filteredAnimals = computed(() => {
    const query = this.normalizedSearch();
    if (!query) return this.animals;
    return this.animals.filter(animal => animal.Name?.toLowerCase().includes(query));
  });

  filteredAnimalsByArticle = computed(() => {
    const query = this.normalizedSearch();
    const entries = [...this.animalsByArticleID().values()];
    if (!query) return entries;
    return entries.filter(entry => entry.animals.some(animal => animal.Name?.toLowerCase().includes(query)));
  });

  ngOnInit() {
    if(this.byArticle) {
      this.sortByAnimalsByArticleID();
    }
  }

  private sortByAnimalsByArticleID() {
    this.animalsByArticleID.update(animalsByArticleID => {
        for (const animal of this.animals) {
          if (!animal.ArticleID) continue;

          const existingEntry = animalsByArticleID.get(animal.ArticleID);

          if (existingEntry) {
            existingEntry.animals.push(animal);
            existingEntry.title += ', ' + animal.Name;
          } else {
            animalsByArticleID.set(animal.ArticleID, {
              animals: [animal],
              title: animal.Name,
            })
          }
        }
        return new Map(animalsByArticleID)
      }
    )
  }


  readonly Object = Object;
}
