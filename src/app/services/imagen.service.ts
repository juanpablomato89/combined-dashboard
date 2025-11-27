import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, Subject, timeout } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { ErrorService } from './error.service';

@Injectable({
  providedIn: 'root',
})
export class ImagenService {
  termino = 'azul';
  page = 1;
  perPage = 30;

  private terminoBusqueda$ = new Subject<string>();
  constructor(private http: HttpClient, private _errorService: ErrorService) {}

  setTerminoBusqueda(termino: string) {
    this.terminoBusqueda$.next(termino);
  }

  getTerminoBusqueda() {
    return this.terminoBusqueda$.asObservable();
  }

  getImagenes(): Observable<any> {
    const URL = `https://pixabay.com/api/?key=${environment.imagenApiKey}&q=${this.termino}&page=${this.page}&per_page=${this.perPage}`;
    return this.http
      .get(URL, {
        observe: 'body',
      })
      .pipe(
        timeout(60000),
        catchError((error) => {
          return of({ imgs: [] });
        })
      );
  }
}
