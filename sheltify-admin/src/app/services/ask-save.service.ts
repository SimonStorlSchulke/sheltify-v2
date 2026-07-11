import { Injectable, signal } from '@angular/core';
import { Subject } from 'rxjs';
import { AlertService } from 'src/app/services/alert.service';

@Injectable({providedIn: 'root'})
export class AskSaveService {

  public readonly dirty = signal(false);
  public readonly triggerSave = new Subject<void>();

  constructor(private alertService: AlertService) {
  }

  public markDirty() {
    console.log("Eintrag editiert")
    if(!this.dirty()) {
      this.dirty.set(true);
    }
  }

  public clean() {
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
