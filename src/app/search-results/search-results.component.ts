import {
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  OnChanges,
  OnInit,
  signal,
} from '@angular/core';
import { SearchService } from '../search.service';
import { MEDICAL_RECORD_INTERFACE } from '../interfaces.interface,';
import { LoadingComponent } from '../loading/loading.component';
import { Router, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-search-results',
  standalone: true,
  imports: [LoadingComponent, DatePipe, RouterLink],
  templateUrl: './search-results.component.html',
  styleUrl: './search-results.component.css',
})
export class SearchResultsComponent implements OnInit, OnChanges {
  searchTerm = input.required<string>();

  private searchService = inject(SearchService);
  private authService = inject(AuthService);

  loggedInUser = computed(() => this.authService.user().uid);
  users = signal<MEDICAL_RECORD_INTERFACE>({
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
  loading = signal(false);

  async ngOnInit() {
    this.loading.set(true);
    await this.searchService
      .searchProfile(this.searchTerm())
      .then((res: any) => {
        this.users.set(res);
      });
    this.loading.set(false);
  }

  async ngOnChanges() {
    this.loading.set(true);
    await this.searchService
      .searchProfile(this.searchTerm())
      .then((res: any) => {
        this.users.set(res);
      });
    this.loading.set(false);
  }
}
