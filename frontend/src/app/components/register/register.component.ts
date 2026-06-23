import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService, RegisterRequest } from '../../auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  data: RegisterRequest = {
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    clan: ''
  };

  error = '';
  fieldErrors: Record<string, string> = {};
  loading = false;

  get passwordWarnings(): string[] {
    const msgs: string[] = [];
    if (!this.data.password) return msgs;
    if (!/[A-Z]/.test(this.data.password)) msgs.push('Debe tener al menos una mayúscula');
    if (!/[0-9]/.test(this.data.password)) msgs.push('Debe tener al menos un número');
    return msgs;
  }

  register(): void {
    if (this.loading) return;
    this.error = '';
    this.fieldErrors = {};
    this.loading = true;

    this.auth.register(this.data).subscribe({
      next: () => this.router.navigate(['/']),
      error: (err) => {
        this.loading = false;
        if (err.status === 0) {
          this.error = 'Error de conexión. Verificá que el backend esté corriendo en el puerto 8080.';
        } else if (err.error && typeof err.error === 'object' && !err.error.error) {
          this.fieldErrors = err.error;
        } else {
          this.error = err.error?.error || 'Error al registrarse';
        }
      }
    });
  }
}
