import { Component, Input } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Product } from '../../utils/data.models';
import { RouterModule } from '@angular/router';
// Import CartService
import { CartService } from '../../services/cart.service';

@Component
({
  selector: 'app-product-card',
  standalone: true,
  imports: [RouterModule, CommonModule, NgOptimizedImage],
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent
{
  @Input() product!: Product;

  // Inject CartService
  constructor(private cartService: CartService) {}

  addToCart(): void
  {
    // Use CartService to add the product
    console.log('Adding to cart:', this.product);
    this.cartService.addToCart(this.product);
  }
}