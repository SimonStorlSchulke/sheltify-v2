import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoaderComponent } from '@app/layout/loader/loader.component';
import { SidebarComponent } from '@app/layout/sidebar/sidebar.component';

@Component({
  selector: 'app-default-layout',
  imports: [
    LoaderComponent,
    RouterOutlet,
    SidebarComponent
  ],
  templateUrl: './default-layout.component.html',
  styleUrl: './default-layout.component.scss',
})
export class DefaultLayoutComponent {

}
