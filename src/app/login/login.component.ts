import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';
import { LoadingComponent } from '../loading/loading.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, FormsModule, LoadingComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);

  loading = signal(false);
  wrongInputs = signal(false);

  ngOnInit(): void {
    if (this.authService.user() && this.router.url === '/') {
      this.router.navigate(['/home']);
    }
  }

  async login(email: string, password: string, event: any) {
    this.loading.set(true);
    event.preventDefault;
    await this.authService.login(email, password);
    if (this.authService.user()) {
      this.loading.set(false);
      this.router.navigate(['/home']);
    } else {
      this.wrongInputs.set(true);
      this.loading.set(false);
    }
  }
}
