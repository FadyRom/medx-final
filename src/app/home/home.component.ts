import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { SearchService } from '../search.service';
import { userReadings } from '../interfaces.interface,';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  private searchService = inject(SearchService);
  private destroyRef = inject(DestroyRef);

  userReadings = signal<userReadings>({
    ecg: '',
    hrate: '',
    temp: '',
    SPO2: '',
  });

  ngOnInit(): void {
    this.getPatientData();

    const intervalFunc = setInterval(() => {
      this.getPatientData();
    }, 100);

    this.destroyRef.onDestroy(() => {
      clearInterval(intervalFunc);
    });
  }

  async getPatientData() {
    await this.searchService
      .getPatientData()
      .then((res: any) => {
        this.userReadings.set(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }
}
