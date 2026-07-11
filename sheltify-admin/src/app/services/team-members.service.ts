import { Injectable, signal, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { CmsPage, CmsTeamMember } from 'sheltify-lib/cms-types';
import { CmsRequestService } from 'src/app/services/cms-request.service';

@Injectable({providedIn: 'root'})
export class TeamMembersService {
  private readonly cmsRequestService = inject(CmsRequestService);

  constructor() {
    this.reloadTeamMembers();
  }

  public teamMembers = signal<CmsTeamMember[]>([]);

  async reloadTeamMembers() {
    const teamMembers = await firstValueFrom(this.cmsRequestService.getTeamMembers());
    this.teamMembers.set(teamMembers ?? []);
  }
}
