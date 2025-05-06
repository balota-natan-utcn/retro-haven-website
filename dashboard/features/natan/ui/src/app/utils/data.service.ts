import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Image, Product, ProductImages } from "./data.models";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class DataService {
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

  getProduct(id: string | null): Observable<Product> {
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

  //getProductImages(id: string | null): Observable<ProductImages[]>
  //{
  //  return this.getProduct(id).pipe(
  //    map(product => product.images || [])
  //  );
  //}
}
