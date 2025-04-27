import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import NasaImagesAPIResponse from '../models/NasaImagesAPIResponse';

@Injectable({
  providedIn: 'root',
})
export class ApiNasaService {
  baseUrlApi = '';

  constructor(private httpClient: HttpClient) {
    this.baseUrlApi = environment.baseUrlApi;
  }

  getImagesNasa(param: string): Observable<NasaImagesAPIResponse> {
    return this.httpClient.get<NasaImagesAPIResponse>(
      `${this.baseUrlApi}?q=${param}`
    );
  }
}
