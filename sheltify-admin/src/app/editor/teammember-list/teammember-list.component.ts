import { Location } from '@angular/common';
import { Component, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { createNewTeamMember } from 'src/app/cms-types/cms-type.factory';
import { CmsTeamMember } from 'sheltify-lib/cms-types';
import { TeammemberEditorComponent } from 'src/app/editor/teammember-editor/teammember-editor.component';
import { TextInputModalComponent } from 'src/app/forms/text-input-modal/text-input-modal.component';
import { LeftSidebarLayoutComponent } from 'src/app/layout/left-sidebar-layout/left-sidebar-layout.component';
import { CmsRequestService } from 'src/app/services/cms-request.service';
import { ModalService } from 'src/app/services/modal.service';
import { TeamMembersService } from 'src/app/services/team-members.service';
import { CmsImageDirective } from 'src/app/ui/cms-image.directive';

@Component({
  selector: 'app-teammember-list',
  imports: [
    TeammemberEditorComponent,
    CmsImageDirective,
    LeftSidebarLayoutComponent
  ],
  templateUrl: './teammember-list.component.html',
  styleUrl: './teammember-list.component.scss',
})
export class TeammemberListComponent {
  constructor(
    public teamMembersService: TeamMembersService,
    private cmsRequestService: CmsRequestService,
    private modalService: ModalService,
    private activatedRoute: ActivatedRoute,
    private location: Location,
  ) {
  }

  ngOnInit() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if(id != null) {
      this.toTeamMember(id);
    }
  }

  selectedTeamMember = signal<CmsTeamMember | null>(null);

  public async newTeamMember() {
    const page = createNewTeamMember();
    page.Name = await this.modalService.openFinishable(TextInputModalComponent, {label: 'Name eingeben'}) ?? '';
    const savedTeamMember = await firstValueFrom(this.cmsRequestService.saveTeamMember(page));
    this.toTeamMember(savedTeamMember.ID);
    this.teamMembersService.reloadTeamMembers();
  }

  public async toTeamMember(id: string) {
    const teamMember = await firstValueFrom(this.cmsRequestService.getTeamMember(id));
    this.selectedTeamMember.set(teamMember);
    this.location.go('/team/' + id);
  }

  public onDeleted() {
    this.selectedTeamMember.set(null);
  }
}
