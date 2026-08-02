import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TextInputModalComponent } from '@app/forms/text-input-modal/text-input-modal.component';
import { TextInputComponent } from '@app/forms/text-input/text-input.component';
import { AlertService } from '@app/services/alert.service';
import { CmsUser } from '@app/services/auth.service';
import { CmsRequestService } from '@app/services/cms-request.service';
import { ModalService } from '@app/services/modal.service';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-administration',
  imports: [
    TextInputComponent
  ],
  templateUrl: './administration.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './administration.component.scss',
})
export class AdministrationComponent {
  private alertService = inject(AlertService);
  private modalService = inject(ModalService);
  private cmsRequestService = inject(CmsRequestService);

  users = toSignal(this.cmsRequestService.getUsers());

  async createUser(): Promise<CmsUser | undefined> {
    const tenant = await this.modalService.openFinishable(TextInputModalComponent, {label: 'Tenant'});
    const username = await this.modalService.openFinishable(TextInputModalComponent, {label: 'Username'});
    const password = await this.modalService.openFinishable(TextInputModalComponent, {label: 'Password'});
    const email = await this.modalService.openFinishable(TextInputModalComponent, {label: 'email'});
    const role = await this.modalService.openFinishable(TextInputModalComponent, {label: 'role'});

    if(!tenant || !username || !password || !email || !role ) return undefined;

    return await lastValueFrom(this.cmsRequestService.createUser(tenant, username, password, email, role));
  }

  async save(user: CmsUser) {
    await lastValueFrom(this.cmsRequestService.saveUser(user));
  }

  async changePassword(userId: string) {
    const newPassword = await this.modalService.openFinishable(TextInputModalComponent, {label: 'Neues Passwort'});
    if(!newPassword) return;
    await lastValueFrom(this.cmsRequestService.changePassword(userId, newPassword));
  }

  async deleteUser(userId: string) {
    if (await this.alertService.confirmDelete()) {
      await lastValueFrom(this.cmsRequestService.deleteUser(userId));
    }
  }
}
