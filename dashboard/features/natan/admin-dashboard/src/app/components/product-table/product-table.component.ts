/*import { Component } from '@angular/core';

@Component({
  selector: 'app-product-table',
  imports: [],
  templateUrl: './product-table.component.html',
  styleUrl: './product-table.component.scss'
})
export class ProductTableComponent {

}
*/

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-table.component.html',
  styleUrls: ['./product-table.component.scss']
})
export class ProductTableComponent implements OnInit {
  products: Product[] = [];
  notification: { message: string, type: 'success' | 'error' } | null = null;
  
  constructor(
    private productService: ProductService, 
    private router: Router
  ) {}
  
  ngOnInit(): void {
    this.productService.getProducts().subscribe(products => {
      this.products = products;
    });
  }
  
  viewProductDetails(id: number): void {
    this.router.navigate(['/products', id]);
  }
  
  deleteProduct(id: number, event: Event): void {
    event.stopPropagation();

      this.productService.deleteProduct(id).subscribe(success => {
        if (success) {
          this.showNotification('Product deleted successfully', 'success');
          // Refresh
          this.productService.getProducts().subscribe(products => {
            this.products = products;
          });
        } else {
          this.showNotification('Failed to delete product', 'error');
        }
      });
    
  }
  
  addNewProduct(): void {
    this.router.navigate(['/products/new']);
  }

  showNotification(message: string, type: 'success' | 'error'): void {
    this.notification = { message, type };
    setTimeout(() => {
      this.notification = null;
    }, 3000);
  }

  generateStars(rating: number): number[] {
    return Array(5).fill(0).map((_, index) => index < rating ? 1 : 0);
  }
}