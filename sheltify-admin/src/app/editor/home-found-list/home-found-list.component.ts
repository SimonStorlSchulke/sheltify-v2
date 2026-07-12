import { DatePipe } from '@angular/common';
import { Component, signal, inject, ChangeDetectionStrategy } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, ActivatedRouteSnapshot, ResolveFn, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { CmsHomeFoundEntry } from 'sheltify-lib/cms-types';
import { createNewHomeFoundEntry } from '@app/cms-types/cms-type.factory';
import { HomeFoundEditorComponent } from '@app/editor/home-found-editor/home-found-editor.component';
import { TextInputModalComponent } from '@app/forms/text-input-modal/text-input-modal.component';
import { LeftSidebarLayoutComponent } from '@app/layout/left-sidebar-layout/left-sidebar-layout.component';
import { CmsRequestService } from '@app/services/cms-request.service';
import { HomeFoundService } from '@app/services/home-found.service';
import { ModalService } from '@app/services/modal.service';

export const homeFoundResolver: ResolveFn<CmsHomeFoundEntry> = (route: ActivatedRouteSnapshot) => {
  const id = route.paramMap.get('id')!;
  return inject(CmsRequestService).getHomeFoundEntry(id);
}

@Component({
  selector: 'app-home-found-list',
  imports: [
    LeftSidebarLayoutComponent,
    HomeFoundEditorComponent,
    DatePipe,
  ],
  templateUrl: './home-found-list.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './home-found-list.component.scss',
})
export class HomeFoundListComponent {
  homeFoundService = inject(HomeFoundService);
  private cmsRequestService = inject(CmsRequestService);
  private router = inject(Router);
  private modalService = inject(ModalService);
  private activatedRoute = inject(ActivatedRoute);

  selectedEntry = signal<CmsHomeFoundEntry | null>(null);

  constructor() {
    this.activatedRoute.data.pipe(takeUntilDestroyed()).subscribe(({entry}) => this.selectedEntry.set(entry));
  }

  async newEntry() {
    const entry = createNewHomeFoundEntry();
    entry.AnimalName = await this.modalService.openFinishable(TextInputModalComponent, {label: 'Tiername(n) eingeben'}) ?? '';
    const savedEntry = await firstValueFrom(this.cmsRequestService.saveHomeFoundEntry(entry));
    await this.toEntry(savedEntry.ID);
    this.homeFoundService.reloadEntries();
  }

  onModified() {
    this.homeFoundService.reloadEntries();
  }

  async toEntry(id: string) {
    await this.router.navigate(['rueckmeldungen', id]);
  }
}
