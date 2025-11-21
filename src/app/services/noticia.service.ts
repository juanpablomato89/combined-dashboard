import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class NoticiaService {
  categoria = 'general';
  pais = 'us';

  constructor(private http: HttpClient) { }

  buscarNoticias(): Observable<any> {

    const URL = `https://newsapi.org/v2/top-headlines?country=${this.pais}&category=${this.categoria}&apiKey=${environment.noticiasApiKey}`;
    return this.http.get(URL);
  }
}
