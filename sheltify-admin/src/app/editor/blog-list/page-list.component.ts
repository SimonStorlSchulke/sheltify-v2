import { Component, signal } from '@angular/core';
import { Location  } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { createNewPage } from 'src/app/cms-types/cms-type.factory';
import { CmsPage } from 'sheltify-lib/cms-types';
import { PageEditorComponent } from 'src/app/editor/page-editor/page-editor.component';
import { TextInputModalComponent } from 'src/app/forms/text-input-modal/text-input-modal.component';
import { LeftSidebarLayoutComponent } from 'src/app/layout/left-sidebar-layout/left-sidebar-layout.component';
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
    private location: Location,
  ) {
  }

  ngOnInit() {
    const path = this.activatedRoute.snapshot.paramMap.get('path');
    if(path != null) {
      this.toPage(path);
    }
  }

  selectedPage = signal<CmsPage | null>(null);

  public async newPage() {
    const page = createNewPage();
    page.Path = await this.modalService.openFinishable(TextInputModalComponent, {label: 'Pfad für die Seite eingeben - dieser darf nur Buchstaben, Zahlen, - und / enthalten.'}) ?? '';
    const savedPage = await firstValueFrom(this.cmsRequestService.savePage(page));
    this.toPage(savedPage.ID);
    this.pagesService.reloadPages();
  }

  public async toPage(path: string) {
    const page = await firstValueFrom(this.cmsRequestService.getPageByPath(path));
    this.selectedPage.set(page);
    this.location.go('/seiten/' + encodeURIComponent(path));
  }

  protected onDeleted() {
    this.pagesService.reloadPages();
    this.selectedPage.set(null);
  }
}
