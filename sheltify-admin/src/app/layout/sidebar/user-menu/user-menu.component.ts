import { Component, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { BtIconComponent } from '@app/ui/bt-icon/bt-icon.component';
import { AuthService } from '../../../services/auth.service';
import { AsyncPipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
    selector: 'app-user-menu',
  imports: [
    AsyncPipe,
    BtIconComponent
  ],
    templateUrl: './user-menu.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './user-menu.component.scss'
})
export class UserMenuComponent implements OnInit {
  authService = inject(AuthService);
  private router = inject(Router);

  user$ = this.authService.user$;

  ngOnInit() {

  }

  logout() {
    this.authService.logout();
    this.router.navigate(["login"])
  }
}
