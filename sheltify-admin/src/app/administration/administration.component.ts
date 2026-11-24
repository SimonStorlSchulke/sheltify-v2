import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { SelectInputComponent } from '@app/forms/select-input/select-input.component';
import { TextInputModalComponent } from '@app/forms/text-input-modal/text-input-modal.component';
import { TextInputComponent } from '@app/forms/text-input/text-input.component';
import { AlertService } from '@app/services/alert.service';
import { CmsUser } from '@app/services/auth.service';
import { CmsRequestService } from '@app/services/cms-request.service';
import { ModalService } from '@app/services/modal.service';
import { lastValueFrom } from 'rxjs';
import { CmsTenantConfiguration } from 'sheltify-lib/cms-types';

export const USER_ROLES = ['SUPERADMIN', 'ADMIN', 'EDITOR', 'UPLOADER'];

@Component({
  selector: 'app-administration',
  imports: [
    TextInputComponent,
    SelectInputComponent,
  ],
  templateUrl: './administration.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './administration.component.scss',
})
export class AdministrationComponent {
  private alertService = inject(AlertService);
  private modalService = inject(ModalService);
  private cmsRequestService = inject(CmsRequestService);

  readonly roles = USER_ROLES;

  users = toSignal(this.cmsRequestService.getUsers());
  tenants = signal<CmsTenantConfiguration[]>([]);

  constructor() {
    this.loadTenants();
  }

  async loadTenants() {
    this.tenants.set(await lastValueFrom(this.cmsRequestService.getTenants()));
  }

  async createTenant(): Promise<CmsTenantConfiguration | undefined> {
    const id = await this.modalService.openFinishable(TextInputModalComponent, {label: 'Tenant ID (nur Kleinbuchstaben a-z)'});
    if (!id) return undefined;
    if (!/^[a-z]+$/.test(id)) {
      this.alertService.openToast('Die Tenant ID darf nur aus Kleinbuchstaben (a-z) bestehen.', 'Fehler', 'error');
      return undefined;
    }
    const name = await this.modalService.openFinishable(TextInputModalComponent, {label: 'Name'});
    if (!name) return undefined;
    const siteUrl = await this.modalService.openFinishable(TextInputModalComponent, {label: 'Site URL'});
    if (!siteUrl) return undefined;

    const created = await lastValueFrom(this.cmsRequestService.createTenant(id, name, siteUrl));
    await this.loadTenants();
    return created;
  }

  async createUser(): Promise<CmsUser | undefined> {
    const tenant = await this.modalService.openFinishable(TextInputModalComponent, {label: 'Tenant'});
    const username = await this.modalService.openFinishable(TextInputModalComponent, {label: 'Username'});
    const password = await this.modalService.openFinishable(TextInputModalComponent, {label: 'Password'});
    const email = await this.modalService.openFinishable(TextInputModalComponent, {label: 'email'});
    const role = (await this.modalService.openFinishable(TextInputModalComponent, {label: 'role', placeHolder: USER_ROLES.join(', ')}))?.trim().toUpperCase();

    if(!tenant || !username || !password || !email || !role ) return undefined;
    if (!USER_ROLES.includes(role)) {
      this.alertService.openToast(`Ungültige Rolle "${role}". Erlaubt: ${USER_ROLES.join(', ')}`, 'Fehler', 'error');
      return undefined;
    }

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
