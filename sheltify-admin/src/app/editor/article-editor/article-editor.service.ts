import { Injectable, signal } from '@angular/core';
import { CmsArticle, Section } from 'sheltify-lib/article-types';
import { createEmptyArticle } from 'src/app/cms-types/cms-type.factory';
import { AlertService } from 'src/app/services/alert.service';

@Injectable({
  providedIn: 'root',
})
export class ArticleEditorService {
  public article = signal<CmsArticle | undefined>(createEmptyArticle());
  public movedItem = signal<{ row: number, sectionRef: Section } | null>(null);

  constructor(private readonly alertService: AlertService) {
  }

  public enterMoveMode(row: number, sectionRef: Section) {
    this.movedItem.set({
      row,
      sectionRef,
    })
  }

  public exitMoveMode() {
    this.movedItem.set(null)
  }

  public async deleteSection(row: number): Promise<void> {
    if (!this.article()) return;
    const answer = await this.alertService.openAlert("Sektion wirklich entfernen?", "", ["nein", "ja"])
    if (answer == 'ja') {
      const article = this.article()!;
      article.Structure.Rows.splice(row, 1);
    }
  }
}
