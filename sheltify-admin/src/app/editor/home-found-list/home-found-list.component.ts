import { DatePipe, Location } from '@angular/common';
import { Component, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { CmsHomeFoundEntry } from 'sheltify-lib/dist/cms-types';
import { createNewHomeFoundEntry } from 'src/app/cms-types/cms-type.factory';
import { HomeFoundEditorComponent } from 'src/app/editor/home-found-editor/home-found-editor.component';
import { TextInputModalComponent } from 'src/app/forms/text-input-modal/text-input-modal.component';
import { LeftSidebarLayoutComponent } from 'src/app/layout/left-sidebar-layout/left-sidebar-layout.component';
import { CmsRequestService } from 'src/app/services/cms-request.service';
import { HomeFoundService } from 'src/app/services/home-found.service';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-home-found-list',
  imports: [
    LeftSidebarLayoutComponent,
    HomeFoundEditorComponent,
    DatePipe,
  ],
  templateUrl: './home-found-list.component.html',
  styleUrl: './home-found-list.component.scss',
})
export class HomeFoundListComponent {
  selectedEntry = signal<CmsHomeFoundEntry | null>(null);

  constructor(
    public homeFoundService: HomeFoundService,
    private cmsRequestService: CmsRequestService,
    private location: Location,
    private modalService: ModalService,
    private activatedRoute: ActivatedRoute,
  ) {
  }

  ngOnInit() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if(id != null) {
      this.toEntry(id);
    }
  }

  public async newEntry() {
    const entry = createNewHomeFoundEntry();
    entry.AnimalName = await this.modalService.openFinishable(TextInputModalComponent, {label: 'Tiername(n) eingeben'}) ?? '';
    const savedEntry = await firstValueFrom(this.cmsRequestService.saveHomeFoundEntry(entry));
    await this.toEntry(savedEntry.ID);
    this.homeFoundService.reloadEntries();
  }

  public onModified() {
    this.homeFoundService.reloadEntries();
  }

  public async toEntry(ID: string) {
    const entry = await firstValueFrom(this.cmsRequestService.getHomeFoundEntry(ID));
    this.selectedEntry.set(entry);
    this.location.go('/rueckmeldungen/' + encodeURIComponent(entry.ID));
  }
}
