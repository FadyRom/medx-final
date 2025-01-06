import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  updateProfile,
} from '@angular/fire/auth';
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  Storage,
} from '@angular/fire/storage';
import { Router } from '@angular/router';
import { from } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { SEARCH_RESPONSE } from './interfaces.interface,';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth = inject(Auth);
  private fireStorage = inject(Storage);
  private router = inject(Router);
  private httpClient = inject(HttpClient);
  private destroyRef = inject(DestroyRef);

  user = signal<any>('');
  userId = signal('');

  downloadUrl = signal('');
  photoUrl = signal<any>('');

  login(email: string, password: string) {
    const promise = signInWithEmailAndPassword(this.auth, email, password)
      .then((res: any) => {
        this.user.set(res.user);
      })
      .catch((err) => {
        console.log(err);
      });
    return promise;
  }

  register(
    email: string,
    password: string,
    username: string,
    file: any,
    location: any,
    birthDate: any,
    phoneNo: any
  ) {
    const userCredintials = createUserWithEmailAndPassword(
      this.auth,
      email,
      password
    ).then(async (response) => {
      this.userId.set(response.user.uid);
      localStorage.setItem('loggedInUserId', this.userId());
      if (file) {
        const path = `profile/${this.userId()}/${file.name}`;
        const storageRef = ref(this.fireStorage, path);
        const uploadTask = uploadBytesResumable(storageRef, file);

        // Listen for state changes, errors, and completion of the upload
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          },
          (error) => {
            console.error('Upload error:', error); // Error handler
          },
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            this.downloadUrl.set(downloadURL);
            this.photoUrl.set(downloadURL);

            const storeUserData = this.storeUsersData(
              username,
              this.downloadUrl(),
              this.userId(),
              email,
              birthDate,
              phoneNo,
              location
            ).subscribe({
              next: (res) => {
                console.log(res);
              },
            });
            console.log('File available at', downloadURL);

            this.destroyRef.onDestroy(() => {
              storeUserData.unsubscribe();
            });
            this.router.navigate(['/home']);
          }
        );
      }

      updateProfile(response.user, { displayName: username });
    });

    return from(userCredintials);
  }

  storeUsersData(
    username: any,
    photoUrl: any,
    uId: any,
    email: any,
    birthDate: any,
    phoneNumber: any,
    location: any
  ) {
    const userData = {
      username,
      photoUrl,
      email,
      phoneNumber,
      birthDate,
      location,
      uId,
    };

    return this.httpClient.put(
      `https://medx-final-default-rtdb.firebaseio.com/usersData/${uId}.json`,
      userData
    );
  }

  async checkUser() {
    const checkUserState = await new Promise((resolve) => {
      this.auth.onAuthStateChanged((resUser: any) => {
        if (resUser) {
          this.user.set(resUser);
          resolve(resUser); // Resolve the promise with the user
        } else {
          this.router.navigate(['/']);
          resolve(null); // Resolve with null if no user
        }
      });
    });
  }
}
