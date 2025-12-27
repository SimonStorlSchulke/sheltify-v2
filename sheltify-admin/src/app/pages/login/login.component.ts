import { Component, inject } from '@angular/core';
import { TenantConfigurationService } from 'src/app/services/tenant-configuration.service';
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
  private tenantConfigurationService = inject(TenantConfigurationService);
  private router = inject(Router);

  onLogin(username: string, password: string) {
    this.authService.login(username, password).subscribe({
      next: (response) => {
        this.toastrService.success("Eingeloggt als " + response.Name);
        this.tenantConfigurationService.reloadConfig();
        this.router.navigate([""]);
      },
      error: (err) => {
        this.toastrService.error("Login failed: " + err.message);
      },
    });
  }
}
