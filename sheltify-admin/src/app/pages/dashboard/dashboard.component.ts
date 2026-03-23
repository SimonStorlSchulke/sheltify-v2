import { Component } from '@angular/core';
import { bootstrapCardImage } from '@ng-icons/bootstrap-icons';
import { provideIcons } from '@ng-icons/core';
import { RecentlyEditedComponent } from 'src/app/pages/dashboard/recently-edited/recently-edited.component';

@Component({
  selector: 'app-dashboard',
  imports: [
    RecentlyEditedComponent
  ],
  providers: [provideIcons({bootstrapCardImage})],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {


  constructor(
    ) {
  }
}
