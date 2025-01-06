import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import {
  getDownloadURL,
  ref,
  Storage,
  uploadBytesResumable,
} from '@angular/fire/storage';
import { LoadingComponent } from '../loading/loading.component';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, LoadingComponent],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent implements OnInit {
  // private authService = inject(AuthService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  private authService = inject(AuthService);

  loading = signal(false);
  notValid = signal<string>('');
  errorMessage = signal('');
  photoUrl = signal<any>(null);
  file = signal<any>('');
  imageUrl: any = '';

  myForm = new FormGroup({
    personalImage: new FormControl('', {
      validators: [Validators.required],
    }),
    email: new FormControl('', {
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl('', {
      validators: [Validators.required, Validators.minLength(6)],
    }),
    confirmPassword: new FormControl('', {
      validators: [Validators.required, Validators.minLength(6)],
    }),
    userName: new FormControl('', {
      validators: [Validators.required],
    }),
    birthDate: new FormControl('', {
      validators: [Validators.required],
    }),
    phoneNo: new FormControl('', {
      validators: [Validators.required],
    }),
    location: new FormControl('', {
      validators: [Validators.required],
    }),
    gender: new FormControl('male', {
      validators: [Validators.required],
    }),
  });

  ngOnInit(): void {
    if (this.authService.user() && this.router.url === '/signup') {
      this.router.navigate(['/home']);
    }
  }

  async uploadImage(event: any) {
    const file = event.target.files[0]; // Get the first file
    if (file) {
      this.file.set(file); // Assuming this.file is a FormControl or a similar data structure

      const reader = new FileReader();

      // Set up a callback for when the reader has completed reading
      reader.onload = () => {
        this.photoUrl.set(reader.result); // Update imageUrl with the file's data URL
      };

      // Read the file as a Data URL
      reader.readAsDataURL(file);
    }
  }

  onSignupSubmit() {
    if (
      this.myForm.valid &&
      this.myForm.controls.password.value ==
        this.myForm.controls.confirmPassword.value
    ) {
      this.loading.set(true);
      const signup = this.authService
        .register(
          this.myForm.controls.email.value!,
          this.myForm.controls.password.value!,
          this.myForm.controls.userName.value!,
          this.file(),
          this.myForm.controls.location.value!,
          this.myForm.controls.birthDate.value!,
          this.myForm.controls.phoneNo.value!
        )
        .subscribe({
          next: (res) => {
            this.router.navigate(['/home']);
          },
          error: (erro) => {
            this.errorMessage.set(erro.code);
            this.loading.set(false);
          },
        });
      this.destroyRef.onDestroy(() => {
        signup.unsubscribe();
      });
    } else {
      this.notValid.set('please fill all the data correctly');
    }
  }
}
