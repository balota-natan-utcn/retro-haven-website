import { Routes } from '@angular/router';
import { ProductTableComponent } from './components/product-table/product-table.component';
import { ProductFormComponent } from './components/product-form/product-form.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';

export const routes: Routes = [
    { path: '', redirectTo: '/products', pathMatch: 'full' },
    { path: 'products', component: ProductTableComponent },
    { path: 'products/new', component: ProductFormComponent },
    { path: 'products/:id', component: ProductDetailComponent },
    { path: '**', redirectTo: '/products' }
  ];