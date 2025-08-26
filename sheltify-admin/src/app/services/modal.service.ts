import { Dialog } from '@angular/cdk/dialog';
import { ComponentType } from '@angular/cdk/portal';
import { Directive, inject, Injectable, OnDestroy, Type } from '@angular/core';
import { firstValueFrom, Observable, Subject } from 'rxjs';
import { AlertButtonName, AlertComponent } from 'src/app/ui/alert/alert.component';

export interface Finishable<TValue> {
  finish: Observable<TValue>;
}

@Directive()
export abstract class FinishableDialog<TValue> implements Finishable<TValue>, OnDestroy {
  protected readonly finishSubject = new Subject<TValue>();
  readonly finish = this.finishSubject.asObservable();

  protected finishWith(value: TValue): void {
    this.finishSubject.next(value);
    this.finishSubject.complete();
  }

  ngOnDestroy(): void {
    this.finishSubject.complete();
  }
}

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  private dialog = inject(Dialog);

  public open<T>(component: ComponentType<T>, inputs?: Partial<T>, cssClass = 'modal-lg') {
    const dialogRef = this.dialog.open(component, {
      panelClass: cssClass,
    });

    if (inputs) {
      Object.assign(dialogRef.componentInstance as any, inputs);
    }

    return dialogRef;
  }

  public openAlert(title: string, message: string, buttons: AlertButtonName[] = ['ok']): void {
    this.open(AlertComponent, {
        title,
        message,
        buttons,
      }, 'modal-alert'
    )
  }


  public async openFinishable<TValue, TComponent extends Finishable<TValue>>(
    component: Type<TComponent>
  ): Promise<TComponent extends FinishableDialog<infer TValue> ? TValue : never> {
    const ref = this.dialog.open(component, {
      panelClass: 'modal-lg',
    });
    const instance = ref.componentInstance;
    const result = await firstValueFrom(instance!.finish);
    ref.close();
    return result as any;
  }
}


