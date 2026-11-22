import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, ActivatedRouteSnapshot, ResolveFn, Router } from '@angular/router';
import { createNewPage } from '@app/cms-types/cms-type.factory';
import { PageEditorComponent } from '@app/editor/page-editor/page-editor.component';
import { TextInputModalComponent } from '@app/forms/text-input-modal/text-input-modal.component';
import { LeftSidebarLayoutComponent } from '@app/layout/left-sidebar-layout/left-sidebar-layout.component';
import { AlertService } from '@app/services/alert.service';
import { CmsRequestService } from '@app/services/cms-request.service';
import { ModalService } from '@app/services/modal.service';
import { PagesService } from '@app/services/pages.service';
import { BtIconComponent } from '@app/ui/bt-icon/bt-icon.component';
import { catchError, firstValueFrom, of } from 'rxjs';
import { CmsPage } from 'sheltify-lib/cms-types';

interface PageGroup {
  /** first part of the path, '' for the start page */
  category: string;
  label: string;
  /** missing if there is no page for the group itself (e.g. only "Hunde/Hündinnen", but no "Hunde") */
  page?: CmsPage;
  children: { label: string, page: CmsPage }[];
}

export const pageResolver: ResolveFn<CmsPage | undefined> = (
  route: ActivatedRouteSnapshot
) => {
  const path = route.paramMap.get('path') ?? '';

  return inject(CmsRequestService).getPageByPath(path).pipe(
    catchError(err => {
      if (path == '' && err.status === 404) {
        // If not startPage (with path '') exist yet, return undefined
        return of(undefined);
      }
      throw err;
    })
  );
};

@Component({
  selector: 'app-page-list',
  imports: [
    PageEditorComponent,
    BtIconComponent,
    LeftSidebarLayoutComponent,
  ],
  templateUrl: './page-list.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './page-list.component.scss',
})
export class PageListComponent {
  pagesService = inject(PagesService);
  private cmsRequestService = inject(CmsRequestService);
  private modalService = inject(ModalService);
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  private alertService = inject(AlertService);

  constructor() {
    this.activatedRoute.data.pipe(takeUntilDestroyed())
      .subscribe(({page}) => this.selectedPage.set(page));
  }

  selectedPage = signal<CmsPage | null>(null);

  /**
   * Pages grouped like the site header (sheltify-lib createPageStructure): "Hunde/Hündinnen" is
   * listed below "Hunde". Groups keep the order of their first page. A group whose own page
   * doesn't exist has no `page` and is shown greyed out.
   */
  pageTree = computed(() => {
    const groups = new Map<string, PageGroup>();
    for (const page of this.pagesService.pages()) {
      const [category, ...rest] = page.Path.split('/');
      if (!groups.has(category)) {
        groups.set(category, { category, label: category || 'Startseite', children: [] });
      }
      const group = groups.get(category)!;
      if (rest.length === 0) {
        group.page = page;
      } else {
        group.children.push({ label: rest.join('/'), page });
      }
    }
    return [...groups.values()];
  });

  /**
   * Asks for the path of a new page and creates it.
   * @param pathPrefix prefilled start of the path, e.g. "Hunde/" for a new sub page of "Hunde"
   */
  async newPage(pathPrefix = ''): Promise<boolean> {
    const input = await this.modalService.openFinishable(TextInputModalComponent, {
      label: pathPrefix
        ? `Pfad für die neue Unterseite von „${pathPrefix.replace(/\/$/, '')}“ eingeben - dieser darf nur Buchstaben, Zahlen, - und / enthalten.`
        : 'Pfad für die Seite eingeben - dieser darf nur Buchstaben, Zahlen, - und / enthalten.',
      presetText: pathPrefix,
    });
    // cancelled - previously this created a page with an empty path (the start page)
    if (input === undefined) return false;

    const path = input.trim().replace(/\/+$/, '');
    if (pathPrefix && (path === '' || path === pathPrefix.replace(/\/$/, ''))) {
      this.alertService.openAlert('Kein Name für die Unterseite', `Bitte hinter „${pathPrefix}“ einen Namen eingeben.`);
      return false;
    }
    return this.createPage(path);
  }

  /** Creates the page for a group that only has sub pages so far (e.g. "Hunde" for "Hunde/Hündinnen"). */
  async createGroupPage(category: string): Promise<boolean> {
    return this.createPage(category);
  }

  private async createPage(path: string): Promise<boolean> {
    const page = createNewPage();
    page.Path = path;

    if (page.Path.includes('&')) {
      this.alertService.openAlert("Pfad kann kein '&' Zeichen enthalten", "Es wurde durch 'und' ersetzt. In der Titelleiste wird trotzdem '&' angezeigt")
      page.Path = page.Path.replaceAll('&', 'und');
    }

    // this should really be done in the backend but ¯\_(ツ)_/¯
    if(this.pagesService.pages().some(foundPage => foundPage.Path === page.Path)) {
      this.alertService.openAlert('Seite mit diesem Pfad existiert bereits', '')
      return false;
    }

    const savedPage = await firstValueFrom(this.cmsRequestService.savePage(page));
    await this.toPage(savedPage.Path);
    this.pagesService.reloadPages();
    return true;
  }

  async toPage(path: string) {
    await this.router.navigate(['seiten', path]);
  }

  onDeleted() {
    this.pagesService.reloadPages();
    this.selectedPage.set(null);
  }
}
