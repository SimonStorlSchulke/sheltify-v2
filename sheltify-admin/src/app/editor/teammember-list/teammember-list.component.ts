import { Location } from '@angular/common';
import { Component, signal, inject, ChangeDetectionStrategy } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, ActivatedRouteSnapshot, ResolveFn, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { createNewTeamMember } from '@app/cms-types/cms-type.factory';
import { CmsTeamMember } from 'sheltify-lib/cms-types';
import { TeammemberEditorComponent } from '@app/editor/teammember-editor/teammember-editor.component';
import { TextInputModalComponent } from '@app/forms/text-input-modal/text-input-modal.component';
import { LeftSidebarLayoutComponent } from '@app/layout/left-sidebar-layout/left-sidebar-layout.component';
import { CmsRequestService } from '@app/services/cms-request.service';
import { ModalService } from '@app/services/modal.service';
import { TeamMembersService } from '@app/services/team-members.service';
import { CmsImageDirective } from '@app/ui/cms-image.directive';

export const teamMemberResolver: ResolveFn<CmsTeamMember> = (route: ActivatedRouteSnapshot) => {
  const id = route.paramMap.get('id')!;
  return inject(CmsRequestService).getTeamMember(id);
}

@Component({
  selector: 'app-teammember-list',
  imports: [
    TeammemberEditorComponent,
    CmsImageDirective,
    LeftSidebarLayoutComponent
  ],
  templateUrl: './teammember-list.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './teammember-list.component.scss',
})
export class TeammemberListComponent {
  teamMembersService = inject(TeamMembersService);
  private cmsRequestService = inject(CmsRequestService);
  private modalService = inject(ModalService);
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);

  constructor() {
    this.activatedRoute.data.pipe(takeUntilDestroyed()).subscribe(({entry}) => this.selectedTeamMember.set(entry));
  }

  selectedTeamMember = signal<CmsTeamMember | null>(null);

  async newTeamMember() {
    const page = createNewTeamMember();
    page.Name = await this.modalService.openFinishable(TextInputModalComponent, {label: 'Name eingeben'}) ?? '';
    const savedTeamMember = await firstValueFrom(this.cmsRequestService.saveTeamMember(page));
    this.toTeamMember(savedTeamMember.ID);
    this.teamMembersService.reloadTeamMembers();
  }

  async toTeamMember(id: string) {
    await this.router.navigate(['team', id]);
  }

  onDeleted() {
    this.selectedTeamMember.set(null);
  }
}
