import { Injectable } from '@angular/core';
import { ModalService } from 'src/app/services/modal.service';
import { AlertButtonName, AlertComponent } from 'src/app/ui/alert/alert.component';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(private modalService: ModalService) {

  }


  public async openAlert(title: string, message: string, buttons: AlertButtonName[] = ['ok']): Promise<AlertButtonName> {
    return await this.modalService.openFinishable(AlertComponent, {
        title,
        message,
        buttons,
      }, 'modal-alert'
    )
  }
}
