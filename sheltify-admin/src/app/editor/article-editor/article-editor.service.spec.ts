import { TestBed } from '@angular/core/testing';
import { Section, SectionColumns } from 'sheltify-lib/article-types';
import { createEmptyArticle } from '@app/cms-types/cms-type.factory';
import { AlertService } from '@app/services/alert.service';
import { AuthService } from '@app/services/auth.service';
import { createEmptySection } from './article-section.factory';
import { ArticleEditorService } from './article-editor.service';

describe('ArticleEditorService', () => {
  let service: ArticleEditorService;
  let openAlert: ReturnType<typeof vi.fn>;
  let tenantId: string;

  const text = (html: string): Section => ({ ...createEmptySection('text'), Content: { Html: html } } as Section);

  function setRows(rows: Section[]) {
    const article = createEmptyArticle();
    article.Structure.Rows = rows;
    service.article.set(article);
  }

  const rows = () => service.article()!.Structure.Rows;

  beforeEach(() => {
    localStorage.clear();
    tenantId = 'tenant1';
    openAlert = vi.fn().mockResolvedValue('ja');
    TestBed.configureTestingModule({
      providers: [
        { provide: AlertService, useValue: { openAlert } },
        { provide: AuthService, useValue: { getTenantID: () => tenantId } },
      ],
    });
    service = TestBed.inject(ArticleEditorService);
  });

  describe('moveMovedSectionTo', () => {
    it('does nothing when not in move mode', () => {
      const a = text('a');
      setRows([a]);
      expect(service.moveMovedSectionTo(rows(), 0)).toBe(false);
    });

    it('moves a section down within the same list', () => {
      const [a, b, c] = [text('a'), text('b'), text('c')];
      setRows([a, b, c]);
      service.enterMoveMode(a);

      // insert position 3 means "after c"
      expect(service.moveMovedSectionTo(rows(), 3)).toBe(true);
      expect(rows()).toEqual([b, c, a]);
    });

    it('moves a section up within the same list', () => {
      const [a, b, c] = [text('a'), text('b'), text('c')];
      setRows([a, b, c]);
      service.enterMoveMode(c);

      service.moveMovedSectionTo(rows(), 0);
      expect(rows()).toEqual([c, a, b]);
    });

    it('moves a section into a column and emits the columns section', () => {
      const a = text('a');
      const columns = createEmptySection('columns') as SectionColumns;
      setRows([a, columns]);
      const moved: Section[] = [];
      service.sectionMoved.subscribe(section => moved.push(section));
      service.enterMoveMode(a);

      const column = columns.Content.Columns[1].Sections;
      expect(service.moveMovedSectionTo(column, 0, columns)).toBe(true);
      expect(rows()).toEqual([columns]);
      expect(column).toEqual([a]);
      expect(moved).toEqual([columns]);
    });

    it('moves a section out of a column', () => {
      const a = text('a');
      const columns = createEmptySection('columns') as SectionColumns;
      columns.Content.Columns[0].Sections.push(a);
      setRows([columns]);
      service.enterMoveMode(a);

      service.moveMovedSectionTo(rows(), 0);
      expect(rows()).toEqual([a, columns]);
      expect(columns.Content.Columns[0].Sections).toEqual([]);
    });

    it('refuses to move sections into columns that are not allowed there', () => {
      const nested = createEmptySection('columns');
      const columns = createEmptySection('columns') as SectionColumns;
      setRows([nested, columns]);
      service.enterMoveMode(nested);

      expect(service.moveMovedSectionTo(columns.Content.Columns[0].Sections, 0, columns)).toBe(false);
      expect(openAlert).toHaveBeenCalled();
      expect(rows()).toEqual([nested, columns]);
    });
  });

  describe('copied section', () => {
    it('stores the copied section per tenant', () => {
      const a = text('a');
      service.setCopiedSection(a);

      expect(service.copiedSection()).toEqual(a);
      expect(service.copiedSection()).not.toBe(a);
      expect(JSON.parse(localStorage.getItem('copiedSection-tenant1')!)).toEqual(a);
    });

    it('clears the copied section', () => {
      service.setCopiedSection(text('a'));
      service.setCopiedSection(null);

      expect(service.copiedSection()).toBeNull();
      expect(localStorage.getItem('copiedSection-tenant1')).toBeNull();
    });

    it('restores the copied section from storage', () => {
      localStorage.setItem('copiedSection-tenant1', JSON.stringify(text('stored')));
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [
          { provide: AlertService, useValue: { openAlert } },
          { provide: AuthService, useValue: { getTenantID: () => tenantId } },
        ],
      });
      expect(TestBed.inject(ArticleEditorService).copiedSection()).toEqual(text('stored'));
    });
  });

  describe('deleteSection', () => {
    it('deletes after confirmation', async () => {
      const [a, b] = [text('a'), text('b')];
      setRows([a, b]);
      await service.deleteSection(0);
      expect(rows()).toEqual([b]);
    });

    it('keeps the section when not confirmed', async () => {
      openAlert.mockResolvedValue('nein');
      const a = text('a');
      setRows([a]);
      await service.deleteSection(0);
      expect(rows()).toEqual([a]);
    });

    it('deletes without asking when confirmation is disabled', async () => {
      setRows([text('a')]);
      await service.deleteSection(0, false);
      expect(openAlert).not.toHaveBeenCalled();
      expect(rows()).toEqual([]);
    });
  });
});
