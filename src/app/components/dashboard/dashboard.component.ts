import { Component, OnDestroy, OnInit } from '@angular/core';
import { finalize, Subject, takeUntil, timer } from 'rxjs';
import { ErrorService } from 'src/app/services/error.service';
import { NoticiaService } from 'src/app/services/noticia.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy{
  listadoNoticias: any[] = [];
  loading = false;
  private destroy$ = new Subject<void>();

  constructor(private _noticiaService: NoticiaService, private _errorService: ErrorService) {
    
  }  

  ngOnInit(): void {
    this.iniciarActualizacionAutomatica();
  }

  private iniciarActualizacionAutomatica(): void {
    timer(0, 180000).pipe(
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.buscarNoticias();
    });
  }
  
  buscarNoticias() {
    this.loading = true;
    this._noticiaService.buscarNoticias().pipe(
      takeUntil(this.destroy$),
      finalize(() => this.loading = false)
    ).subscribe({
      next: (response) => {
        this.listadoNoticias = response.articles;
      },
      error: (error) => {
        this._errorService.setError(error);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}