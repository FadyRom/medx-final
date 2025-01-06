import {
  AfterViewInit,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { LoadingComponent } from './loading/loading.component';
import { NavComponent } from './nav/nav.component';
import { LoginComponent } from './login/login.component';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavComponent, LoadingComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit, AfterViewInit {
  private router = inject(Router);
  private authService = inject(AuthService);

  loading = signal(false);

  async ngOnInit() {
    this.loading.set(true);
    await this.authService.checkUser();
    if (this.authService.user() && location.pathname === '/signup') {
      this.router.navigate(['/home']);
    } else if (this.authService.user() && location.pathname === '/') {
      this.router.navigate(['/home']);
    } else if (!this.authService.user() && location.pathname === '/') {
      this.router.navigate(['/']);
    } else if (!this.authService.user() && location.pathname === '/') {
      this.router.navigate(['/']);
    }
  }

  ngAfterViewInit(): void {
    this.loading.set(false);
  }

  shouldShowNav(): boolean {
    const currentPath = this.router.url;
    return currentPath !== '/' && currentPath !== '/signup';
  }
}
