import { Service, signal, inject } from '@angular/core';
import { Subject } from 'rxjs';
import { CmsArticle, Section, SectionType } from 'sheltify-lib/article-types';
import { createEmptyArticle } from '@app/cms-types/cms-type.factory';
import { AlertService } from '@app/services/alert.service';
import { AuthService } from '@app/services/auth.service';
import { sectionLabels } from '@app/services/article-renderer';

/** Section types that cannot be placed inside a column. */
export const typesNotAllowedInColumns: SectionType[] = ['columns', 'animal-list', 'animal-updates'];

@Service()
export class ArticleEditorService {
  private alertService = inject(AlertService);
  private authService = inject(AuthService);

  article = signal<CmsArticle | undefined>(createEmptyArticle());
  /** Section currently being moved. Works for top level rows and sections inside columns. */
  movedItem = signal<{ sectionRef: Section } | null>(null);
  private readonly copiedSectionState = signal<Section | null>(this.readCopiedSection());
  readonly copiedSection = this.copiedSectionState.asReadonly();

  constructor() {
    window.addEventListener('storage', (event) => {
      if (event.key === null || event.key === this.copiedSectionStorageKey()) {
        this.copiedSectionState.set(this.readCopiedSection());
      }
    });
  }

  setCopiedSection(section: Section | null) {
    const key = this.copiedSectionStorageKey();
    if (section) {
      const json = JSON.stringify(section);
      try {
        localStorage.setItem(key, json);
      } catch {
        // storage full/unavailable: the clipboard still works in this tab
      }
      this.copiedSectionState.set(JSON.parse(json));
    } else {
      localStorage.removeItem(key);
      this.copiedSectionState.set(null);
    }
  }

  private copiedSectionStorageKey() {
    return `copiedSection-${this.authService.getTenantID()}`;
  }

  private readCopiedSection(): Section | null {
    try {
      const stored = localStorage.getItem(this.copiedSectionStorageKey());
      return stored ? JSON.parse(stored) as Section : null;
    } catch {
      return null;
    }
  }

  /**
   * Emits the top level row section that should be selected after a move:
   * the moved section itself, or the columns section it was moved into.
   */
  readonly sectionMoved = new Subject<Section>();

  enterMoveMode(sectionRef: Section) {
    this.movedItem.set({ sectionRef });
  }

  exitMoveMode() {
    this.movedItem.set(null)
  }

  /**
   * Moves the section in move mode to `targetIndex` of `target`, which is either the
   * article rows or the section list of a column. The source is looked up by reference.
   * @param targetColumnsSection the columns section that owns `target`, if `target` is a column.
   */
  moveMovedSectionTo(target: Section[], targetIndex: number, targetColumnsSection?: Section): boolean {
    const moved = this.movedItem()?.sectionRef;
    const article = this.article();
    if (!moved || !article) return false;

    if (targetColumnsSection && typesNotAllowedInColumns.includes(moved.SectionType)) {
      this.alertService.openAlert(`${sectionLabels.get(moved.SectionType) ?? 'Diese Sektion'} kann nicht in Spalten verschoben werden`, '');
      return false;
    }

    const source = this.findContainingList(article.Structure.Rows, moved);
    if (!source) return false;

    const sourceIndex = source.indexOf(moved);
    if (source === target && sourceIndex < targetIndex) {
      targetIndex--;
    }
    source.splice(sourceIndex, 1);
    target.splice(targetIndex, 0, moved);

    this.sectionMoved.next(targetColumnsSection ?? moved);
    return true;
  }

  /** Finds the list (article rows or a column) that contains `section`. */
  private findContainingList(rows: Section[], section: Section): Section[] | undefined {
    if (rows.includes(section)) return rows;
    for (const row of rows) {
      if (row.SectionType !== 'columns') continue;
      for (const column of row.Content.Columns) {
        if (column.Sections.includes(section)) return column.Sections;
      }
    }
    return undefined;
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
