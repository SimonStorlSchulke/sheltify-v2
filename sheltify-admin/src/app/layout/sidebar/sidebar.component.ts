import { Component, inject } from '@angular/core';
import { UserMenuComponent } from './user-menu/user-menu.component';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-sidebar',
    imports: [
        UserMenuComponent,
        RouterLink,
        RouterLinkActive
    ],
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  private authService = inject(AuthService);
  router = inject(Router);


  logout() {
    this.authService.logout();
    this.router.navigate(["login"])
  }
}
