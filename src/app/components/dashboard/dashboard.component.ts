import { Component, OnDestroy, OnInit } from '@angular/core';
import { finalize, forkJoin, map, merge, Observable, scan, Subject, takeUntil, timer } from 'rxjs';
import { DashboardItem, ImgItem, NewsItem } from 'src/app/models/DashboardItem';
import { ErrorService } from 'src/app/services/error.service';
import { ImagenService } from 'src/app/services/imagen.service';
import { NoticiaService } from 'src/app/services/noticia.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy{
  listadoNoticias: any[] = [];
  listadoImagenes: any[] = [];
  loading = false;
  private destroy$ = new Subject<void>();

  constructor(
    private _noticiaService: NoticiaService,
    private _errorService: ErrorService,
    private _imagenService: ImagenService) {
    
  }  

  ngOnInit(): void {
    this.iniciarActualizacionAutomatica();
  }

  private iniciarActualizacionAutomatica(): void {
    timer(0, 180000).pipe(
      takeUntil(this.destroy$)
    ).subscribe(() => {
      //this.buscarNoticias();
      //this.buscarImagenes();
      this.getCombinedStream().pipe(
        takeUntil(this.destroy$),
        finalize(() => this.loading = false)
      ).subscribe({
        next: (response) => {
          console.log(response);
        },
        error: (error) => {
          this._errorService.setError(error);
        }
      });
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

  buscarImagenes(): any {
    this.loading = true;
    this._imagenService.getImagenes().pipe(
      takeUntil(this.destroy$),
      finalize(() => this.loading = false)
    ).subscribe({
      next: (data) => {
        if (data.hits.length === 0) {
          this._errorService.setError('Opsssss... No se encontro ningun resultado');
          return;
        }

        return this.listadoImagenes = data.hits;
      },
      error: (error) => {
        this._errorService.setError(error);
      }
    });
  }

  getCombinedStream(): Observable<any[]> {
    return forkJoin({
      noticias: this._noticiaService.buscarNoticias(),
      imagenes: this._imagenService.getImagenes()
    }).pipe(
      map(({ noticias, imagenes }) => {
        // Extraer el array de noticias de la respuesta
        const newsList = noticias.articles || [];

        const newsItems: NewsItem[] = newsList.map((article: any) => ({
          type: 'news' as const,
          title: article.title || '',
          summary: article.description || article.content || '',
          source: article.source?.name || 'Fuente desconocida',
          imageUrl: article.urlToImage,
          id: article.url, // ejemplo usando la URL como ID
          date: article.publishedAt ? new Date(article.publishedAt) : new Date()
        }));


        // Extraer el array de imágenes de la respuesta
        const imagesList = imagenes.hits || [];

        const newsImg: ImgItem[] = imagesList.map((article: any) => ({
          type: 'img' as const,
          title: article.title || '',
          summary: article.description || article.content || '',
          source: article.source?.name || 'Fuente desconocida',
          imageUrl: article.urlToImage,
          id: article.url, // ejemplo usando la URL como ID
          date: article.publishedAt ? new Date(article.publishedAt) : new Date()
        }));

        // Combinar los dos arrays
        return [...newsItems, ...newsImg];
      })
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}