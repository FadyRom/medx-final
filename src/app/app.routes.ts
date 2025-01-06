import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { MedicalRecordComponent } from './medical-record/medical-record.component';
import { HomeComponent } from './home/home.component';
import { SearchResultsComponent } from './search-results/search-results.component';
import { EditMedicalRecordComponent } from './edit-medical-record/edit-medical-record.component';

export const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
  },
  {
    path: 'signup',
    component: SignupComponent,
  },
  {
    path: 'medical-record',
    component: MedicalRecordComponent,
  },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'search/:searchTerm',
    component: SearchResultsComponent,
  },
  {
    path: 'edit-medical-record/:searchTerm',
    component: EditMedicalRecordComponent,
  },
  {
    path: '**',
    component: HomeComponent,
  },
];
