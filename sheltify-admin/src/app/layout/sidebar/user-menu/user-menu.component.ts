import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { AsyncPipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
    selector: 'app-user-menu',
    imports: [
        AsyncPipe
    ],
    templateUrl: './user-menu.component.html',
    styleUrl: './user-menu.component.scss'
})
export class UserMenuComponent implements OnInit {
  authService = inject(AuthService);
  private toastrService = inject(ToastrService);
  private router = inject(Router);

  user$ = this.authService.user$;

  ngOnInit() {

  }
}
