import { Service, signal, inject } from '@angular/core';
import { Subject } from 'rxjs';
import { AlertService } from '@app/services/alert.service';

@Service()
export class AskSaveService {
  private alertService = inject(AlertService);

  readonly dirty = signal(false);
  readonly triggerSave$ = new Subject<string[]>();
  private readonly dirtyIds = new Set<string>();


  getDirtyIds(): ReadonlySet<string> {
    return this.dirtyIds;
  }

  markDirty(editedId?: string) {
    if (!this.dirty()) {
      this.dirty.set(true);
    }
    if (editedId) {
      console.log("make dirty", editedId);
      this.dirtyIds.add(editedId);
    }
  }

  isIdDirty(id: string): boolean {
    return this.dirtyIds.has(id);
  }

  clean() {
    this.dirty.set(false);
    this.dirtyIds.clear();
  }

  cleanId(editedId: string) {
    this.dirtyIds.delete(editedId);
    this.dirty.set(this.dirtyIds.size > 0);
  }

  async askSave(): Promise<boolean> {
    if (!this.dirty()) return true;
    const answer = await this.alertService.openAlert('Änderungen speichern?', '', ['ja', 'nein', 'abbrechen']);
    const ids = Array.from(this.dirtyIds);
    this.clean();

    if (answer == 'abbrechen') {
      return false
    }
    if (answer == 'ja') {
      this.triggerSave$.next(ids);
    }
    return true;
  }
}
