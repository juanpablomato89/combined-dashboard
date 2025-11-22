import { Component, OnDestroy, OnInit } from '@angular/core';
import { catchError, finalize, forkJoin, map, merge, Observable, of, scan, Subject, takeUntil, timer } from 'rxjs';
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
  combinedList: any[] = [];
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
      this.getCombinedStream().pipe(
        takeUntil(this.destroy$),
        finalize(() => this.loading = false)
      ).subscribe({
        next: (response) => {
          this.combinedList = response;
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
      noticias: this._noticiaService.buscarNoticias().pipe(catchError(() => of({ news: [] }))),
      imagenes: this._imagenService.getImagenes().pipe(catchError(() => of({ imgs: [] }))),
    }).pipe(
      map(({ noticias, imagenes }) => {
        // Extraer el array de noticias de la respuesta
        const newsList = noticias.articles || [];

        const newsItems: NewsItem[] = newsList.map((article: any) => ({
          type: 'news' as const,
          urlToImage: article.urlToImage || '',
          name: article.source.name || '',
          title: article.title || 'Fuente desconocida',
          description: article.description,
          url: article.url,
          date: article.publishedAt ? new Date(article.publishedAt) : new Date(),
          id: article.url
        }));


        // Extraer el array de imágenes de la respuesta
        const imagesList = imagenes.hits || [];
        const newsImg: ImgItem[] = imagesList.map((img: any) => ({
          type: 'img' as const,
          previewURL: img.previewURL || '',
          largeImageURL: img.largeImageURL || '',
          likes: img.likes,
          views: img.views,
          id: img.previewURL,
          date: new Date(2025,10,this.getRandomInt(1,30))
        }));

        const arrayResult = [...newsItems, ...newsImg];
        
        return arrayResult.sort((a, b) => {
          const dateA = a.date.getTime();
          const dateB = b.date.getTime();
          return dateB - dateA;
        });
      })
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getRandomInt(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

}