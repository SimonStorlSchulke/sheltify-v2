import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  standalone: true,
})
export class LoginComponent {
  private authService = inject(AuthService);
  private toastrService = inject(ToastrService);
  private router = inject(Router);

  onLogin(username: string, password: string): void {
    this.authService.login(username, password).subscribe({
      next: (response) => {
        this.toastrService.success("Logged in as " + response.ID);
        this.router.navigate(["dashboard"]);
      },
      error: (err) => {
        this.toastrService.error("Login failed: " + err.message);
      },
    });
  }
}
