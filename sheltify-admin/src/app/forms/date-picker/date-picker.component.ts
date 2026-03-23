import { Component, computed, input, model } from '@angular/core';
import { SqlNullTime } from 'sheltify-lib/dist/cms-types';
import { InputBaseComponent } from 'src/app/forms/input-base.component';

@Component({
  selector: 'app-date-picker',
  imports: [],
  templateUrl: './date-picker.component.html',
  styleUrl: './date-picker.component.scss'
})
export class DatePickerComponent extends InputBaseComponent {

  public mode = input<'SqlNullTime' | 'String' | 'Date'>('Date')

  public twoWayModel = model<Date>();
  public twoWayModelISOString = model<string | null>();
  public twoWayModelSqlNullTime = model<SqlNullTime>();
  public nullTimeValid = input<boolean>(true);

  public dateOnly = computed(() => {

    if(this.mode() == 'SqlNullTime') {
      const time = this.twoWayModelSqlNullTime();

      if(time) {
        return time.Valid ? this.getDateString(new Date(time.Time!)) : '';
      }
    }

    return this.twoWayModelISOString()?.split('T')[0];
  });

  public onInput(event: Event) {
    const date = new Date((event.target as any).value);
    this.twoWayModel.set(date);
    const dateString = date.toISOString();
    this.twoWayModelISOString.set(dateString);
    this.twoWayModelSqlNullTime.set({Valid: true, Time: dateString})
  }

  public getDateString(date: Date): string {
    return date.toISOString().split('T')[0];
  }
}
