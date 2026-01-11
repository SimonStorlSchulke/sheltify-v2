import { Injectable } from '@angular/core';
import { ModalService } from 'src/app/services/modal.service';
import { AlertChoice, AlertComponent } from 'src/app/ui/alert/alert.component';
import { ToastComponent, ToastLevel } from 'src/app/ui/toast/toast.component';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(private modalService: ModalService) {

  }


  public async openAlert(title: string, message: string, buttons: AlertChoice[] = ['ok']): Promise<AlertChoice | undefined> {
    return (await this.modalService.openFinishable(AlertComponent, {
        title,
        message,
        buttons,
      }, 'modal-alert'
    ))?.choice;
  }

  public async openOptionsPrompt(title: string, message: string, options: string[], optionTranslations?: string[]): Promise<string | undefined> {
    return (await this.modalService.openFinishable(AlertComponent, {
        title,
        message,
        options,
        optionTranslations,
        buttons: ['abbrechen'],
      }, 'modal-alert'
    ))?.option;
  }

  public openToast(message: string, title: string = '', level: ToastLevel = 'info'): void {
    this.modalService.open(ToastComponent, {
        title,
        message,
        level,
      }, 'modal-toast',
      false,
    )
  }
}
