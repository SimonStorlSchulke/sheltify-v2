import { Component, computed, input, model, ChangeDetectionStrategy } from '@angular/core';
import { SqlNullTime } from 'sheltify-lib/dist/cms-types';
import { InputBaseComponent } from '@app/forms/input-base.component';

@Component({
  selector: 'app-date-picker',
  imports: [],
  templateUrl: './date-picker.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './date-picker.component.scss'
})
export class DatePickerComponent extends InputBaseComponent {

  mode = input<'SqlNullTime' | 'String' | 'Date'>('Date')

  twoWayModel = model<Date>();
  twoWayModelISOString = model<string | null>();
  twoWayModelSqlNullTime = model<SqlNullTime>();
  nullTimeValid = input<boolean>(true);

  dateOnly = computed(() => {

    if(this.mode() == 'SqlNullTime') {
      const time = this.twoWayModelSqlNullTime();

      if(time) {
        return time.Valid ? this.getDateString(new Date(time.Time!)) : '';
      }
    }

    return this.twoWayModelISOString()?.split('T')[0];
  });

  onInput(event: Event) {
    this.askSaveService.markDirty();
    const date = new Date((event.target as any).value);
    this.twoWayModel.set(date);
    const dateString = date.toISOString();
    this.twoWayModelISOString.set(dateString);
    this.twoWayModelSqlNullTime.set({Valid: true, Time: dateString})
  }

  getDateString(date: Date): string {
    return date.toISOString().split('T')[0];
  }
}
