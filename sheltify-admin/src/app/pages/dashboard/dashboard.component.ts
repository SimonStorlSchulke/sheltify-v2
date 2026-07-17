import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RecentFormsComponent } from '@app/pages/dashboard/recent-forms/recent-forms.component';
import { bootstrapCardImage } from '@ng-icons/bootstrap-icons';
import { provideIcons } from '@ng-icons/core';
import { RecentlyEditedComponent } from '@app/pages/dashboard/recently-edited/recently-edited.component';

@Component({
  selector: 'app-dashboard',
  imports: [
    RecentlyEditedComponent,
    RecentFormsComponent
  ],
  providers: [provideIcons({bootstrapCardImage})],
  templateUrl: './dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {


  constructor(
    ) {
  }
}
