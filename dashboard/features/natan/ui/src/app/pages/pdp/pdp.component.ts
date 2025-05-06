import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../../utils/data.service';
import { Observable } from 'rxjs';
import { Product, ProductImages } from '../../utils/data.models';
import { AsyncPipe, NgOptimizedImage, NgClass } from '@angular/common';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-pdp',
  standalone: true,
  imports: [AsyncPipe, NgOptimizedImage, NgClass],
  templateUrl: './pdp.component.html',
  styleUrl: './pdp.component.scss'
})
export class PdpComponent implements OnInit {
  productId: string | null = null;
  product$!: Observable<Product>;
  productImages: ProductImages[] = [];
  selectedImage: ProductImages | null = null;
  productDescription: string[] | null = null;
  
  private dataService = inject(DataService);
  private cartService = inject(CartService);

  
  constructor(private route: ActivatedRoute) {}
  
  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id');
    if (this.productId)
    {
      this.product$ = this.dataService.getProduct(this.productId);

      this.dataService.getProduct(this.productId).subscribe(product =>
        {
          this.productImages = product.images;
        });
    }
  }
  
  changeImage(image: ProductImages): void {
    this.selectedImage = image;
  }
  
  isActive(image: ProductImages): boolean {
    return this.selectedImage?.imageId === image.imageId;
  }
  
  addToCart(product: Product): void
  {
    this.cartService.addToCart(product);
  }
}