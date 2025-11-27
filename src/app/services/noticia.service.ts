import { Injectable } from '@angular/core';
import { catchError, Observable, of, timeout } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';
import { ErrorService } from './error.service';

@Injectable({
  providedIn: 'root',
})
export class NoticiaService {
  categoria = 'general';
  pais = 'us';

  constructor(private http: HttpClient, private _errorService: ErrorService) {}

  getNoticias(): Observable<any> {
    const URL = `https://newsapi.org/v2/top-headlines?country=${this.pais}&category=${this.categoria}&apiKey=${environment.noticiasApiKey}`;
    return this.http.get(URL).pipe(
      timeout(60000),
      catchError((error) => {
        return of({ news: [] });
      })
    );
  }
}
