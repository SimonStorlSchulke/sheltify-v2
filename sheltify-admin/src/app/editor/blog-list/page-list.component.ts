import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, ActivatedRouteSnapshot, ResolveFn, Router } from '@angular/router';
import { createNewPage } from '@app/cms-types/cms-type.factory';
import { PageEditorComponent } from '@app/editor/page-editor/page-editor.component';
import { TextInputModalComponent } from '@app/forms/text-input-modal/text-input-modal.component';
import { LeftSidebarLayoutComponent } from '@app/layout/left-sidebar-layout/left-sidebar-layout.component';
import { LoaderService } from '@app/layout/loader/loader.service';
import { AlertService } from '@app/services/alert.service';
import { CmsRequestService } from '@app/services/cms-request.service';
import { ModalService } from '@app/services/modal.service';
import { PagesService } from '@app/services/pages.service';
import { BtIconComponent } from '@app/ui/bt-icon/bt-icon.component';
import { catchError, firstValueFrom, of } from 'rxjs';
import { CmsPage } from 'sheltify-lib/cms-types';

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

  async newPage() {
    const page = createNewPage();
    page.Path = await this.modalService.openFinishable(TextInputModalComponent, {label: 'Pfad für die Seite eingeben - dieser darf nur Buchstaben, Zahlen, - und / enthalten.'}) ?? '';

    if (page.Path.includes('&')) {
      this.alertService.openAlert("Pfad kann kein '&' Zeichen enthalten", "Es wurde durch 'und' ersetzt. In der Titelleiste wird trotzdem '&' angezeigt")
      page.Path = page.Path.replaceAll('&', '');
    }

    // this should really be done in the backend but ¯\_(ツ)_/¯
    if(this.pagesService.pages().some(foundPage => foundPage.Path === page.Path)) {
      this.alertService.openAlert('Seite mit diesem Pfad existiert bereits', '')
      return;
    }

    const savedPage = await firstValueFrom(this.cmsRequestService.savePage(page));
    await this.toPage(savedPage.Path);
    this.pagesService.reloadPages();
  }

  async toPage(path: string) {
    await this.router.navigate(['seiten', path]);
  }

  onDeleted() {
    this.pagesService.reloadPages();
    this.selectedPage.set(null);
  }

  readonly encodeURIComponent = encodeURIComponent;
}
