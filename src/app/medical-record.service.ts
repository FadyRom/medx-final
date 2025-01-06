import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { MEDICAL_RECORD_INTERFACE } from './interfaces.interface,';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MedicalRecordService {
  private httpClient = inject(HttpClient);
  private authService = inject(AuthService);

  submitMr(
    firstName: any,
    lastName: any,
    gender: any,
    date: any,
    phoneNo: any,
    nationalId: any,
    conditions: any,
    medications: any,
    allergies: any,
    substances: any,
    photoUrl: any
  ) {
    const fullName = firstName + ' ' + lastName;
    const medicalRecord = {
      fullName,
      gender,
      date,
      phoneNo,
      nationalId,
      conditions,
      medications,
      allergies,
      substances,
      photoUrl,
    };
    return this.httpClient.put<MEDICAL_RECORD_INTERFACE>(
      `https://medx-final-default-rtdb.firebaseio.com/medical-record/${
        this.authService.user().uid
      }.json`,
      medicalRecord
    );
  }

  getMr() {
    return lastValueFrom(
      this.httpClient.get(
        `https://medx-final-default-rtdb.firebaseio.com/medical-record/${
          this.authService.user().uid
        }.json`
      )
    );
  }
}
