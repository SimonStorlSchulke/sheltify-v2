import { Component, input } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { CmsTeamMember } from 'sheltify-lib/cms-types';
import { ImagePickerSingleComponent } from 'src/app/forms/image-picker-single/image-picker-single.component';
import { NumberInputComponent } from 'src/app/forms/number-input/number-input.component';
import { TextInputComponent } from 'src/app/forms/text-input/text-input.component';
import { CmsRequestService } from 'src/app/services/cms-request.service';
import { TeamMembersService } from 'src/app/services/team-members.service';

@Component({
  selector: 'app-teammember-editor',
  imports: [
    TextInputComponent,
    ImagePickerSingleComponent,
    NumberInputComponent
  ],
  templateUrl: './teammember-editor.component.html',
  styleUrl: './teammember-editor.component.scss',
})
export class TeammemberEditorComponent {
  teamMember = input.required<CmsTeamMember>();

  constructor(
    private cmsRequestService: CmsRequestService,
    private teamMembersService: TeamMembersService,
  ) {
  }

  public async save() {
    const teamMember = await firstValueFrom(this.cmsRequestService.saveTeamMember(this.teamMember()));
    if(teamMember) {
      this.teamMembersService.reloadTeamMembers();
    }
  }
}
