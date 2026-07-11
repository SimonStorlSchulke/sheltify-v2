import { Component, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { CmsPage } from 'sheltify-lib/cms-types';
import { createNewPage } from 'src/app/cms-types/cms-type.factory';
import { PageEditorComponent } from 'src/app/editor/page-editor/page-editor.component';
import { TextInputModalComponent } from 'src/app/forms/text-input-modal/text-input-modal.component';
import { LeftSidebarLayoutComponent } from 'src/app/layout/left-sidebar-layout/left-sidebar-layout.component';
import { AlertService } from 'src/app/services/alert.service';
import { CmsRequestService } from 'src/app/services/cms-request.service';
import { ModalService } from 'src/app/services/modal.service';
import { PagesService } from 'src/app/services/pages.service';
import { BtIconComponent } from 'src/app/ui/bt-icon/bt-icon.component';

@Component({
  selector: 'app-page-list',
  imports: [
    PageEditorComponent,
    BtIconComponent,
    LeftSidebarLayoutComponent,
  ],
  templateUrl: './page-list.component.html',
  styleUrl: './page-list.component.scss',
})
export class PageListComponent {

  constructor(
    public pagesService: PagesService,
    private cmsRequestService: CmsRequestService,
    private modalService: ModalService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private alertService: AlertService,
  ) {
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
    if(this.pagesService.pages().findIndex(foundPage => foundPage.Path === page.Path) != -1) {
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
