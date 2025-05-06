import { AsyncPipe, NgOptimizedImage } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { BannerService, Image } from './banner.service';
import { map, Observable, tap } from 'rxjs';
import { DataService } from '../../utils/data.service';


@Component({
  selector: 'app-banner',
  imports: [NgOptimizedImage, AsyncPipe],
  templateUrl: './banner.component.html',
  styleUrl: './banner.component.scss',
  providers: [

  ]
})
export class BannerComponent implements OnInit {
  dataService = inject(DataService);

  image$: Observable<Image> = this.dataService.getImage();

  ngOnInit(): void {
    this.dataService.getImage().pipe(
      tap(response => console.log(response)),
      map(response => response.src === './banner.jpg' ? true : false),
      tap(response => console.log(response)),
    ).subscribe();
  }

}
