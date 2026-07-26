import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { ComponentType } from '@angular/cdk/portal';
import { Directive, inject, OnDestroy, Service, Type } from '@angular/core';
import { firstValueFrom, Observable, Subject } from 'rxjs';

export interface Finishable<TValue> {
  finish: Observable<TValue | undefined>;
  isModal: boolean;
}

@Directive()
export abstract class FinishableDialog<TValue> implements Finishable<TValue>, OnDestroy {
  isModal = false;
  readonly finishSubject = new Subject<TValue | undefined>();
  readonly finish = this.finishSubject.asObservable();

  finishWith(value: TValue) {
    this.finishSubject.next(value);
    this.finishSubject.complete();
  }

  cancel() {
    this.finishSubject.next(undefined);
    this.finishSubject.complete();
  }

  ngOnDestroy() {
    this.finishSubject.complete();
  }
}

@Service()
export class ModalService {

  private dialog = inject(Dialog);

  open<T>(component: ComponentType<T>, inputs?: Partial<T>, cssClass = 'modal-lg', hasBackdrop = true) {
    const dialogRef = this.dialog.open(component, {
      panelClass: cssClass,
      hasBackdrop,
    });

    if (inputs) {
      Object.assign(dialogRef.componentInstance as any, inputs);
    }

    return dialogRef;
  }

  async openFinishable<TValue, TComponent extends Finishable<TValue>>(
    component: Type<TComponent>,
    inputs?: Partial<TComponent>,
    cssClass = 'modal-lg'
  ): Promise<TComponent extends FinishableDialog<infer TValue> ? (TValue | undefined) : never> {
    const dialogRef = this.dialog.open(component, {
      panelClass: cssClass,
    });

    if (inputs) {
      Object.assign(dialogRef.componentInstance as any, inputs);
    }

    const instance = dialogRef.componentInstance!;
    instance.isModal = true;
    const result = await firstValueFrom(instance.finish);
    dialogRef.close();
    return result as any;
  }
}


