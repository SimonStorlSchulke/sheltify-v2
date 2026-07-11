import { Injectable, signal, inject } from '@angular/core';
import { Subject } from 'rxjs';
import { AlertService } from '@app/services/alert.service';

@Injectable({providedIn: 'root'})
export class AskSaveService {
  private alertService = inject(AlertService);


  readonly dirty = signal(false);
  readonly triggerSave = new Subject<void>();

  markDirty() {
    console.log("Eintrag editiert")
    if(!this.dirty()) {
      this.dirty.set(true);
    }
  }

  clean() {
    this.dirty.set(false);
  }

  async askSave(): Promise<boolean> {
    if(!this.dirty()) return true;
    const answer = await this.alertService.openAlert('Änderungen speichern?', '', ['ja', 'nein', 'abbrechen']);

    this.clean();

    if(answer == 'abbrechen') {
      return false
    }
    if(answer == 'ja') {
      this.triggerSave.next();
    }
    return true;
  }
}
