import { Component, inject } from '@angular/core';
import { AlertService } from 'src/app/services/alert.service';
import { TenantConfigurationService } from 'src/app/services/tenant-configuration.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  standalone: true,
})
export class LoginComponent {
  private authService = inject(AuthService);
  private alertService = inject(AlertService);
  private tenantConfigurationService = inject(TenantConfigurationService);
  private router = inject(Router);

  onLogin(username: string, password: string) {
    this.authService.login(username, password).subscribe({
      next: (response) => {
        this.alertService.openToast("Eingeloggt als " + response.Name);
        this.tenantConfigurationService.reloadConfig();
        this.router.navigate([""]);
      },
      error: (err) => {
        this.alertService.openToast("Login failed: " + err.message, '', 'error');
      },
    });
  }
}
