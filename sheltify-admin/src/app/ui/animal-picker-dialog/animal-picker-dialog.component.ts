import { NgTemplateOutlet } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { CmsAnimal } from 'sheltify-lib/cms-types';
import { FinishableDialog } from 'src/app/services/modal.service';

@Component({
  selector: 'app-animal-picker-dialog',
  imports: [
    NgTemplateOutlet
  ],
  templateUrl: './animal-picker-dialog.component.html',
  styleUrl: './animal-picker-dialog.component.scss',
})
export class AnimalPickerDialogComponent extends FinishableDialog<CmsAnimal> implements OnInit {
  public animals: CmsAnimal[] = [];
  public byArticle = false;

  public animalsByArticleID = signal(new Map<string, { animals: CmsAnimal[], title: string }>());

  public ngOnInit() {
    if(this.byArticle) {
      this.sortByAnimalsByArticleID();
    }
  }

  private sortByAnimalsByArticleID(): void {
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
        return animalsByArticleID
      }
    )
  }


  protected readonly Object = Object;
}
