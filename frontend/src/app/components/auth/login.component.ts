import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService, LoginRequest } from '../../auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  data: LoginRequest = { email: '', password: '' };
  error = '';
  loading = false;

  login(): void {
    if (this.loading) return;
    this.error = '';
    this.loading = true;

    this.auth.login(this.data).subscribe({
      next: () => this.router.navigate(['/']),
      error: (err) => {
        this.loading = false;
        this.error = err.error?.error || 'Error de conexión. Verificá que el backend esté corriendo en el puerto 8080.';
      }
    });
  }
}
