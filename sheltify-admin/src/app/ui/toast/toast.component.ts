import { DialogRef } from '@angular/cdk/dialog';
import { Component } from '@angular/core';

export type ToastLevel = 'info' | 'success' | 'warning' | 'error';

const readingTimeMsPerChar = 40;

@Component({
  selector: 'app-toast',
  imports: [],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss',
})
export class ToastComponent {
  level: ToastLevel = 'info';
  title: string = '';
  message: string = '';

  constructor(public dialogRef: DialogRef<ToastComponent>) {
  }

  public ngOnInit() {
    const readingTime = Math.max((this.title.length + this.message.length) * readingTimeMsPerChar, 1000);
    setTimeout(() => {
      this.dialogRef.close();
    }, readingTime);
  }
}
