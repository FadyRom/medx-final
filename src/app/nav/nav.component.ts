import { Component, inject, OnInit, signal } from '@angular/core';
// import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
// import { AuthService } from '../auth.service';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';
import { MedicalRecordService } from '../medical-record.service';
import { AuthService } from '../auth.service';
// import { GetProfilesService } from '../get-profiles.service';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css',
})
export class NavComponent implements OnInit {
  private auth = inject(Auth);
  private mrService = inject(MedicalRecordService);
  private router = inject(Router);
  private authService = inject(AuthService);

  showNav = signal(false);

  ngOnInit(): void {}

  showSelectedNav() {
    this.showNav.set(!this.showNav());
  }

  searchProfile(searchTerm: string) {
    if (searchTerm) {
      this.router.navigate(['search/', searchTerm]);
    }
  }

  showProfile() {
    this.auth.onAuthStateChanged((user) => {
      if (user) {
        const uid = user.uid;
        console.log('User ID:', uid);
      }
    });
  }

  async medicalRecord() {
    const mr = await this.mrService.getMr();
    if (mr) {
      this.router.navigate(['/search/', this.authService.user().uid]);
    } else {
      this.router.navigate(['/medical-record']);
    }
  }

  logout() {
    const confirmLogout = confirm('are you sure you want to logout?');
    if (confirmLogout) {
      this.router.navigate(['/signup']);
      this.auth.signOut();
      location.reload();
    } else {
      return;
    }
  }
}
