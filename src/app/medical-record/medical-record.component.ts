import {
  Component,
  computed,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MedicalRecordService } from '../medical-record.service';
import { LoadingComponent } from '../loading/loading.component';
import { AuthService } from '../auth.service';
import { lastValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { SearchService } from '../search.service';

@Component({
  selector: 'app-medical-record',
  standalone: true,
  imports: [ReactiveFormsModule, LoadingComponent],
  templateUrl: './medical-record.component.html',
  styleUrl: './medical-record.component.css',
})
export class MedicalRecordComponent implements OnInit {
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  private mrService = inject(MedicalRecordService);
  private searchService = inject(SearchService);
  private httpClient = inject(HttpClient);
  private authService = inject(AuthService);

  showNavLocation = location.pathname;

  show = signal(false);
  invalidForm = signal('');
  loading = signal(false);

  ngOnInit(): void {
    this.searchService
      .searchProfile(this.authService.user().uid)
      .then((res) => {
        if (res) {
          this.router.navigate([
            '/edit-medical-record/',
            this.authService.user().uid,
          ]);
        }
      });
  }

  medicalRecordForm = new FormGroup({
    firstName: new FormControl('', {
      validators: [Validators.required],
    }),
    lastName: new FormControl('', {
      validators: [Validators.required],
    }),
    gender: new FormControl('male', {
      validators: [Validators.required],
    }),
    date: new FormControl('', {
      validators: [Validators.required],
    }),
    phoneNumber: new FormControl('', {
      validators: [Validators.required],
    }),
    nationalId: new FormControl('', {
      validators: [Validators.required],
    }),
    conditions: new FormArray([new FormControl('none')]),
    medications: new FormArray([new FormControl('none')]),

    allergies: new FormArray([new FormControl('none')]),
    substances: new FormArray([
      new FormControl(false),
      new FormControl(false),
      new FormControl(false),
    ]),
  });

  addAllergy() {
    if (this.medicalRecordForm.controls.allergies.length == 0) {
      (this.medicalRecordForm.get('allergies') as FormArray).push(
        new FormControl('')
      );
    }
    if (
      this.medicalRecordForm.controls.allergies.at(-1).value !== '' &&
      this.medicalRecordForm.controls.allergies.at(-1).value !== 'none'
    ) {
      (this.medicalRecordForm.get('allergies') as FormArray).push(
        new FormControl('')
      );
    }
  }

  removeAllergy($index: number) {
    if (this.medicalRecordForm.controls.allergies.length !== 1) {
      let allergiesArray = this.medicalRecordForm.controls.allergies.value;
      allergiesArray = allergiesArray.filter(
        (v) => v !== allergiesArray[$index]
      );
      (this.medicalRecordForm.get('allergies') as FormArray).reset();
      (this.medicalRecordForm.get('allergies') as FormArray).patchValue(
        allergiesArray
      );
      this.medicalRecordForm.controls.allergies.removeAt(-1);
    }
  }

  addMedication() {
    if (this.medicalRecordForm.controls.medications.length == 0) {
      (this.medicalRecordForm.get('medications') as FormArray).push(
        new FormControl('')
      );
    }
    if (
      this.medicalRecordForm.controls.medications.at(-1).value !== '' &&
      this.medicalRecordForm.controls.medications.at(-1).value !== 'none'
    ) {
      (this.medicalRecordForm.get('medications') as FormArray).push(
        new FormControl('')
      );
    }
  }

  removeMedication($index: number) {
    if (this.medicalRecordForm.controls.medications.length !== 1) {
      let allergiesArray = this.medicalRecordForm.controls.medications.value;
      allergiesArray = allergiesArray.filter(
        (v) => v !== allergiesArray[$index]
      );
      (this.medicalRecordForm.get('medications') as FormArray).reset();
      (this.medicalRecordForm.get('medications') as FormArray).patchValue(
        allergiesArray
      );
      this.medicalRecordForm.controls.medications.removeAt(-1);
    }
  }

  addcondition() {
    if (this.medicalRecordForm.controls.conditions.length == 0) {
      (this.medicalRecordForm.get('conditions') as FormArray).push(
        new FormControl('')
      );
    }
    if (
      this.medicalRecordForm.controls.conditions.at(-1).value !== '' &&
      this.medicalRecordForm.controls.conditions.at(-1).value !== 'none'
    ) {
      (this.medicalRecordForm.get('conditions') as FormArray).push(
        new FormControl('')
      );
    }
  }

  removecondition($index: number) {
    if (this.medicalRecordForm.controls.conditions.length !== 1) {
      let allergiesArray = this.medicalRecordForm.controls.conditions.value;
      allergiesArray = allergiesArray.filter(
        (v) => v !== allergiesArray[$index]
      );
      (this.medicalRecordForm.get('conditions') as FormArray).reset();
      (this.medicalRecordForm.get('conditions') as FormArray).patchValue(
        allergiesArray
      );
      this.medicalRecordForm.controls.conditions.removeAt(-1);
    }
  }

  onCancel() {
    const confirmation: boolean = window.confirm(
      'are you sure you want to cancel?'
    );
    if (confirmation) {
      this.medicalRecordForm.reset();
    }
  }

  getPhotoUrl() {
    return lastValueFrom(
      this.httpClient.get(
        `https://medx-final-default-rtdb.firebaseio.com/usersData/${
          this.authService.user().uid
        }/photoUrl.json`
      )
    );
  }

  async onSubmit() {
    this.loading.set(true);
    if (this.medicalRecordForm.valid) {
      const photoUrl = await this.getPhotoUrl();

      const sub = this.mrService
        .submitMr(
          this.medicalRecordForm.controls.firstName.value,
          this.medicalRecordForm.controls.lastName.value,
          this.medicalRecordForm.controls.gender.value,
          this.medicalRecordForm.controls.date.value,
          this.medicalRecordForm.controls.phoneNumber.value,
          this.medicalRecordForm.controls.nationalId.value,
          this.medicalRecordForm.controls.conditions.value,
          this.medicalRecordForm.controls.medications.value,
          this.medicalRecordForm.controls.allergies.value,
          this.medicalRecordForm.controls.substances.value,
          photoUrl
        )
        .subscribe({
          next: () => {},
          complete: () => {
            this.loading.set(false);
            this.router.navigate(['/search/', this.authService.user().uid]);
          },
          error: () => {
            this.loading.set(false);
          },
        });
      this.destroyRef.onDestroy(() => {
        sub.unsubscribe();
      });
    } else {
      this.invalidForm.set('Please fill the data correctly...');
      this.loading.set(false);
    }
  }
}
