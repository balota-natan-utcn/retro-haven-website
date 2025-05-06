import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductCardComponent } from '../product-card/product-card.component';
import { Observable, BehaviorSubject, combineLatest, map } from 'rxjs';
import { DataService } from '../../utils/data.service';
import { Product } from '../../utils/data.models';

@Component
({
  selector: 'app-product-grid',
  standalone: true,
  imports: [CommonModule, FormsModule, ProductCardComponent],
  templateUrl: './product-grid.component.html',
  styleUrls: ['./product-grid.component.scss']
})
export class ProductGridComponent implements OnInit
{
  dataService = inject(DataService);
  
  // Source products observable
  private productsSource$: Observable<Product[]> = this.dataService.getProducts();
  
  // Filter state
  selectedConsole = new BehaviorSubject<string>('all');
  availableConsoles: string[] = [];

  // Filtered products - initialize it with a default value
  filteredProducts$: Observable<Product[]> = this.dataService.getProducts();

  ngOnInit()
  {
    // Create the filtered products observable
    this.filteredProducts$ = combineLatest([
      this.productsSource$,
      this.selectedConsole
    ]).pipe(
      map(([products, selectedConsole]) =>
      {
        // Extract all available categories for the filter dropdown
        this.extractConsoles(products);
        
        // Filter products based on selected console
        if (selectedConsole === 'all')
        {
          return products;
        }
        return products.filter(product => product.console === selectedConsole);
      })
    );
  }

  // Extract unique categories from products
  private extractConsoles(products: Product[]): void
  {
    const categories = new Set<string>();
    products.forEach(product =>
    {
      if (product.console)
      {
        categories.add(product.console);
      }
    });
    this.availableConsoles = Array.from(categories);
  }

  // Filter by console
  onConsoleChange(event: Event): void
  {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedConsole.next(selectElement.value);
  }
}