import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoaderComponent } from '@app/layout/loader/loader.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';

@Component({
    selector: 'app-root',
  imports: [RouterOutlet, SidebarComponent, LoaderComponent],
    templateUrl: './app.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'sheltify-admin';
}
