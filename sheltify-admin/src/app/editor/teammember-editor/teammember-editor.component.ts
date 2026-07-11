import { Component, input, output, inject, ChangeDetectionStrategy } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { CmsTeamMember } from 'sheltify-lib/cms-types';
import { ImagePickerSingleComponent } from '@app/forms/image-picker-single/image-picker-single.component';
import { NumberInputComponent } from '@app/forms/number-input/number-input.component';
import { TextInputComponent } from '@app/forms/text-input/text-input.component';
import { CmsRequestService } from '@app/services/cms-request.service';
import { TeamMembersService } from '@app/services/team-members.service';

@Component({
  selector: 'app-teammember-editor',
  imports: [
    TextInputComponent,
    ImagePickerSingleComponent,
    NumberInputComponent
  ],
  templateUrl: './teammember-editor.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './teammember-editor.component.scss',
})
export class TeammemberEditorComponent {
  private cmsRequestService = inject(CmsRequestService);
  private teamMembersService = inject(TeamMembersService);

  teamMember = input.required<CmsTeamMember>();
  deleted = output<void>();

  async save() {
    const teamMember = await firstValueFrom(this.cmsRequestService.saveTeamMember(this.teamMember()));
    if (teamMember) {
      this.teamMembersService.reloadTeamMembers();
    }
  }

  async delete() {
    await firstValueFrom(this.cmsRequestService.deleteTeamMember([this.teamMember().ID]));
    this.teamMembersService.reloadTeamMembers();
    this.deleted.emit();
  }
}
