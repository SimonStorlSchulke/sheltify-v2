import { Service, signal, inject } from '@angular/core';
import { CmsArticle, Section } from 'sheltify-lib/article-types';
import { createEmptyArticle } from '@app/cms-types/cms-type.factory';
import { AlertService } from '@app/services/alert.service';

@Service()
export class ArticleEditorService {
  private alertService = inject(AlertService);

  article = signal<CmsArticle | undefined>(createEmptyArticle());
  movedItem = signal<{ row: number, sectionRef: Section } | null>(null);
  copiedSection = signal<Section | null>(null);

  enterMoveMode(row: number, sectionRef: Section) {
    this.movedItem.set({
      row,
      sectionRef,
    })
  }

  exitMoveMode() {
    this.movedItem.set(null)
  }

  async deleteSection(row: number, withConfirm = true) {
    const article = this.article()!;
    if (!article) return;

    if(withConfirm) {
      const answer = await this.alertService.openAlert("Sektion wirklich entfernen?", "", ["nein", "ja"])
      if (answer == 'ja') article.Structure.Rows.splice(row, 1);
    } else {
      article.Structure.Rows.splice(row, 1);
    }
  }
}
