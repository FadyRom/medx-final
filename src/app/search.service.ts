import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { child, Database, get, ref } from '@angular/fire/database';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  private httpClient = inject(HttpClient);
  private db = inject(Database);

  async searchProfile(searchTerm: string) {
    return lastValueFrom(
      this.httpClient.get(
        `https://medx-final-default-rtdb.firebaseio.com/medical-record/${searchTerm}.json`
      )
    );
  }
}
