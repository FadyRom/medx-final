import {
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MedicalRecordService } from '../medical-record.service';
import { LoadingComponent } from '../loading/loading.component';
import { AuthService } from '../auth.service';
import { lastValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { MEDICAL_RECORD_INTERFACE } from '../interfaces.interface,';
import { SearchService } from '../search.service';

@Component({
  selector: 'app-edit-medical-record',
  standalone: true,
  imports: [ReactiveFormsModule, LoadingComponent, FormsModule],
  templateUrl: './edit-medical-record.component.html',
  styleUrl: './edit-medical-record.component.css',
})
export class EditMedicalRecordComponent implements OnInit {
  searchTerm = input.required<string>();

  private destroyRef = inject(DestroyRef);
  private httpClient = inject(HttpClient);
  private router = inject(Router);
  private searchService = inject(SearchService);
  private mrService = inject(MedicalRecordService);
  private authService = inject(AuthService);

  showNavLocation = location.pathname;

  show = signal(false);
  invalidForm = signal('');
  loading = signal(false);
  getMedicalRecord = signal<MEDICAL_RECORD_INTERFACE>({
    allergies: [],
    conditions: [],
    date: '',
    fullName: '',
    gender: '',
    medications: [],
    nationalId: 0,
    phoneNo: '',
    substances: [],
    photoUrl: '',
  });

  firstName = signal<string>('');
  lastName = signal<string>('');
  gender = signal('');
  date = signal('');
  phoneNumber = signal('');
  nationalId = signal<number>(0);
  conditions = signal<any[]>(['none']);
  medications = signal<any[]>(['none']);
  allergies = signal<any[]>(['none']);
  substances = signal<boolean[]>([]);

  async ngOnInit() {
    this.loading.set(true);
    await this.searchService
      .searchProfile(this.searchTerm())
      .then((res: any) => {
        this.getMedicalRecord.set(res);
        this.firstName.set(this.getMedicalRecord().fullName.split(' ')[0]);
        this.lastName.set(this.getMedicalRecord().fullName.split(' ')[1]);
        this.gender.set(this.getMedicalRecord().gender);
        this.date.set(this.getMedicalRecord().date);
        this.phoneNumber.set(this.getMedicalRecord().phoneNo);
        this.nationalId.set(this.getMedicalRecord().nationalId);
        if (this.getMedicalRecord().conditions) {
          this.conditions.set(this.getMedicalRecord().conditions);
        }
        if (this.getMedicalRecord().medications) {
          this.medications.set(this.getMedicalRecord().medications);
        }
        if (this.getMedicalRecord().allergies) {
          this.allergies.set(this.getMedicalRecord().allergies);
        }

        this.substances.set(this.getMedicalRecord().substances);
      });
    this.loading.set(false);
  }

  addAllergy() {
    console.log(this.allergies());
    if (this.allergies().length == 0) {
      this.allergies().push('');
    }
    if (this.allergies().at(-1) !== '' && this.allergies().at(-1) !== 'none') {
      this.allergies().push('');
    }
  }

  removeAllergy($index: number) {
    let allergiesArray = this.allergies();
    allergiesArray = allergiesArray.filter((v) => v !== allergiesArray[$index]);
    this.allergies.set(allergiesArray);
  }

  addMedication() {
    if (this.medications().length == 0) {
      this.medications().push('');
    }
    if (
      this.medications().at(-1) !== '' &&
      this.medications().at(-1) !== 'none'
    ) {
      this.medications().push('');
    }
  }

  removeMedication($index: number) {
    let allergiesArray = this.medications();
    allergiesArray = allergiesArray.filter((v) => v !== allergiesArray[$index]);
    this.medications.set(allergiesArray);
  }

  addcondition() {
    if (this.conditions().length == 0) {
      this.conditions().push('');
    }
    if (
      this.conditions().at(-1) !== '' &&
      this.conditions().at(-1) !== 'none'
    ) {
      this.conditions().push('');
    }
  }

  removecondition($index: number) {
    let allergiesArray = this.conditions();
    allergiesArray = allergiesArray.filter((v) => v !== allergiesArray[$index]);
    this.conditions.set(allergiesArray);
  }

  onCancel() {
    const confirmation: boolean = window.confirm(
      'are you sure you want to cancel?'
    );
    if (confirmation) {
      this.router.navigate(['/search/', this.authService.user().uid]);
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

  async onSubmit(
    event: Event,
    alcohol: boolean,
    smoke: boolean,
    drugs: boolean,
    myForm: HTMLFormElement
  ) {
    event.preventDefault();

    this.substances.set([alcohol, smoke, drugs]);
    if (this.allergies().length == 0) {
      this.allergies.set(['none']);
    }
    if (this.medications().length == 0) {
      this.medications.set(['none']);
    }
    if (this.conditions().length == 0) {
      this.conditions.set(['none']);
    }

    this.loading.set(true);
    if (
      this.firstName() != '' &&
      this.lastName() != '' &&
      this.date() &&
      this.nationalId() &&
      this.phoneNumber() &&
      this.gender()
    ) {
      const photoUrl = await this.getPhotoUrl();
      const sub = this.mrService
        .submitMr(
          this.firstName(),
          this.lastName(),
          this.gender(),
          this.date(),
          this.phoneNumber(),
          this.nationalId(),
          this.conditions(),
          this.medications(),
          this.allergies(),
          this.substances(),
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
