import { Component, computed, model } from '@angular/core';
import { InputBaseComponent } from 'src/app/forms/input-base.component';

@Component({
  selector: 'app-date-picker',
  imports: [],
  templateUrl: './date-picker.component.html',
  styleUrl: './date-picker.component.scss'
})
export class DatePickerComponent extends InputBaseComponent {
  public twoWayModel = model<Date>();
  public twoWayModelISOString = model<string>();
  public twoWayModelISOStringDateOnly = model<string>();

  public dateOnly = computed(() => {
    return this.twoWayModelISOString()?.split('T')[0]
  })

  public onInput(event: Event) {
    const date = new Date((event.target as any).value);
    this.twoWayModel.set(date);
    this.twoWayModelISOString.set(this.getDateString(date));
    this.twoWayModelISOStringDateOnly.set(this.getDateOnlyString(date));
  }

  public getDateString(date: Date): string {
    return date.toISOString();
  }

  public getDateOnlyString(date: Date) {
    if(!date) return '';
    return date.toISOString().split('T')[0];
  }
}
