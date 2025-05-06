import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Product } from '../models/product.model';
import { HttpClient } from '@angular/common/http';
import { Image } from '../models/image.model';
import { map } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  http = inject(HttpClient);
  
  getImage(): Observable<Image> {
      return this.http.get<Image>('http://localhost:3100/image');
  }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>('http://localhost:3100/products').pipe(
      map(products => 
        products?.map(product => ({
          ...product,
          image: `http://localhost:3100/images/${product.image}` // Main image for PLP
        })) || []
      )
    );
  }  

  /*getProductById(id: string | null | number): Observable<Product> {
      return this.http.get<Product>(`http://localhost:3100/product/${id}`);
  }*/

  getProductById(id: number | null): Observable<Product> {
    return this.http.get<Product>(`http://localhost:3100/product/${id}`).pipe(
      map(product => ({
        ...product,
        image: `http://localhost:3100/images/${product.image}`,  // Main image
        images: product.images?.map(img => ({
          ...img,
          src: `http://localhost:3100/images/${img.src}` // Additional images for PDP
        })) || [],  // Ensure no errors if images are missing
        description: product.description
      }))
    );
  }
  
  
  addProduct(product: Product): Observable<Product> {
    return this.http.post<Product>('http://localhost:3100/products', product);
  }
  
  updateProduct(product: Product): Observable<Product> {
    return this.http.put<Product>(`http://localhost:3100/products/${product.id}`, product);
  }
  
  deleteProduct(id: number): Observable<boolean> {
    return this.http.delete<boolean>(`http://localhost:3100/products/${id}`);
  }  
}