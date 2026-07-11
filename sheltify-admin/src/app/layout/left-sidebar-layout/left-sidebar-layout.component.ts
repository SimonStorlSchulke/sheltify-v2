import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-left-sidebar-layout',
  imports: [],
  templateUrl: './left-sidebar-layout.component.html',
  styleUrl: './left-sidebar-layout.component.scss',
})
export class LeftSidebarLayoutComponent {
  mobileOpen = signal(false);
}
