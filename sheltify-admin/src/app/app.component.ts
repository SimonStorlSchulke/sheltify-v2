import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FooterComponent } from 'src/app/layout/footer/footer.component';
import { LoaderComponent } from 'src/app/layout/loader/loader.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';

@Component({
    selector: 'app-root',
  imports: [RouterOutlet, SidebarComponent, FooterComponent, LoaderComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'sheltify-admin';

  taostrService = inject(ToastrService)

  constructor() {
    this.taostrService.toastrConfig.positionClass = 'toast-bottom-right';
  }

}
