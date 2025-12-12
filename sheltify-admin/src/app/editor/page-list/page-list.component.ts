import { Component, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { CmsArticle } from 'src/app/cms-types/article-types';
import { createEmptyArticle, createNewPage } from 'src/app/cms-types/cms-type.factory';
import { CmsAnimal, CmsPage } from 'src/app/cms-types/cms-types';
import { ArticleEditorComponent } from 'src/app/editor/article-editor/article-editor.component';
import { PageEditorComponent } from 'src/app/editor/page-editor/page-editor.component';
import { TextInputModalComponent } from 'src/app/forms/text-input-modal/text-input-modal.component';
import { CmsRequestService } from 'src/app/services/cms-request.service';
import { ModalService } from 'src/app/services/modal.service';
import { PagesService } from 'src/app/services/pages.service';

@Component({
  selector: 'app-page-list',
  imports: [
    PageEditorComponent,
  ],
  templateUrl: './page-list.component.html',
  styleUrl: './page-list.component.scss',
})
export class PageListComponent {

  constructor(
    public pagesService: PagesService,
    private cmsRequestService: CmsRequestService,
    private modalService: ModalService,
  ) {
  }

  selectedPage = signal<CmsPage | null>(null);

  public async newPage() {

    const page = createNewPage();
    page.Path = await this.modalService.openFinishable(TextInputModalComponent, {label: 'Pfad für die Seite eingeben - dieser muss mit / beginnen und darf nur Buchstaben, Zahlen, - und / enthalten.'}) ?? '';
    if(page.Path == '') return;
    page.Title = this.pagesService.createTitleFromPath(page.Path);
    await firstValueFrom(this.cmsRequestService.savePage(page));
    this.pagesService.reloadPages();
    page.Title = this.pagesService.createTitleFromPath(page.Path);
    await firstValueFrom(this.cmsRequestService.savePage(page));
    this.pagesService.reloadPages();
  }

  public async toPage(path: string) {
    const page = await firstValueFrom(this.cmsRequestService.getPageByPath(path));
    this.selectedPage.set(page);
  }
}
