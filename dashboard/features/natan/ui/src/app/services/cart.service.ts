import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CartItem } from '../models/cart.model';
import { Product } from '../utils/data.models';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private itemsSubject = new BehaviorSubject<CartItem[]>([]);
  items$: Observable<CartItem[]> = this.itemsSubject.asObservable();
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    // Load cart from local storage only if in browser
    if (this.isBrowser) {
      const savedCart = localStorage.getItem('shoppingCart');
      if (savedCart) {
        this.itemsSubject.next(JSON.parse(savedCart));
      }
    }
  }

  addToCart(product: Product): void {
    const currentItems = this.itemsSubject.getValue();
    const existingItemIndex = currentItems.findIndex(item => item.product.id === product.id);

    if (existingItemIndex > -1) {
      const updatedItems = [...currentItems];
      updatedItems[existingItemIndex] = {
        ...updatedItems[existingItemIndex],
        quantity: updatedItems[existingItemIndex].quantity + 1
      };
      this.itemsSubject.next(updatedItems);
    } else {
      this.itemsSubject.next([...currentItems, { product, quantity: 1 }]);
    }
    this.saveCart();
  }

  getItems(): Observable<CartItem[]> {
    return this.items$;
  }

  getItemCount(): Observable<number> {
    return this.items$.pipe(
      map(items => items.reduce((count, item) => count + item.quantity, 0))
    );
  }

  getTotalPrice(): Observable<number> {
    return this.items$.pipe(
      map(items => items.reduce((total, item) => total + (item.product.currentPrice * item.quantity), 0))
    );
  }

  removeFromCart(productId: string): void {
    const updatedItems = this.itemsSubject.getValue().filter(item => ''+item.product.id != productId);
    this.itemsSubject.next(updatedItems);
    this.saveCart();
  }

  clearCart(): void {
    this.itemsSubject.next([]);
    this.saveCart();
  }

  private saveCart(): void {
    // Save cart to local storage only if in browser
    if (this.isBrowser) {
      localStorage.setItem('shoppingCart', JSON.stringify(this.itemsSubject.getValue()));
    }
  }
}
