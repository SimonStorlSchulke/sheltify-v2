import { Service, signal, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { CmsPage, CmsTeamMember } from 'sheltify-lib/cms-types';
import { CmsRequestService } from '@app/services/cms-request.service';

@Service()
export class TeamMembersService {
  private readonly cmsRequestService = inject(CmsRequestService);

  constructor() {
    this.reloadTeamMembers();
  }

  teamMembers = signal<CmsTeamMember[]>([]);

  async reloadTeamMembers() {
    const teamMembers = await firstValueFrom(this.cmsRequestService.getTeamMembers());
    this.teamMembers.set(teamMembers ?? []);
  }
}
