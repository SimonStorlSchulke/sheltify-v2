import { Service, inject } from '@angular/core';
import { ModalService } from '@app/services/modal.service';
import { AlertChoice, AlertComponent } from '@app/ui/alert/alert.component';
import { ToastComponent, ToastLevel } from '@app/ui/toast/toast.component';

@Service()
export class AlertService {
  private modalService = inject(ModalService);


  async openAlert(title: string, message: string, buttons: AlertChoice[] = ['ok']): Promise<AlertChoice | undefined> {
    return (await this.modalService.openFinishable(AlertComponent, {
        title,
        message,
        buttons,
      }, 'modal-alert'
    ))?.choice;
  }

  async confirmDelete(): Promise<boolean> {
    const result = await this.openAlert('Löschen bestätigen', 'Möchten Sie den Eintrag wirklich löschen? Dieser Vorgang kann nicht rückgängig gemacht werden.', ['ja', 'nein']);
    return result === 'ja';
  }

  async openOptionsPrompt(title: string, message: string, options: string[], optionTranslations?: string[]): Promise<string | undefined> {
    return (await this.modalService.openFinishable(AlertComponent, {
        title,
        message,
        options,
        optionTranslations,
        buttons: ['abbrechen'],
      }, 'modal-alert'
    ))?.option;
  }

  openToast(message: string, title: string = '', level: ToastLevel = 'info') {
    this.modalService.open(ToastComponent, {
        title,
        message,
        level,
      }, 'modal-toast',
      false,
    )
  }
}
