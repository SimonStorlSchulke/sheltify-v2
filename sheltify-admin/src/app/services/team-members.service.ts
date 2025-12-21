import { Injectable, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { CmsPage, CmsTeamMember } from 'sheltify-lib/cms-types';
import { CmsRequestService } from 'src/app/services/cms-request.service';

@Injectable({
  providedIn: 'root',
})
export class TeamMembersService {
  constructor(private readonly cmsRequestService: CmsRequestService) {
    this.reloadTeamMembers();
  }

  public teamMembers = signal<CmsTeamMember[]>([]);

  public async reloadTeamMembers() {
    const teamMembers = await firstValueFrom(this.cmsRequestService.getTeamMembers());
    this.teamMembers.set(teamMembers ?? []);
  }
}
