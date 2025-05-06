/*import { Component } from '@angular/core';

@Component({
  selector: 'app-product-form',
  imports: [],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss'
})
export class ProductFormComponent {

}*/

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-form',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent implements OnInit {
  productForm!: FormGroup;
  notification: { message: string, type: 'success' | 'error' } | null = null;
  
  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private router: Router
  ) {}
  
  ngOnInit(): void {
    this.initForm();
  }
  
  initForm(): void {
    this.productForm = this.fb.group({
      title: ['', [Validators.required]],
      imageUrl: ['./assets/images/matrix.jpg', [Validators.required]],
      rating: [5, [Validators.required, Validators.min(1), Validators.max(5)]],
      oldPrice: [0, [Validators.required, Validators.min(0)]],
      currentPrice: [0, [Validators.required, Validators.min(0)]],
      discount: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
      isFavorite: [false]
    });
  }
  
  onSubmit(): void {
    if (this.productForm.valid) {
      this.productService.addProduct(this.productForm.value).subscribe({
        next: () => {
          this.showNotification('Product added successfully', 'success');
          this.router.navigate(['/products']);
        },
        error: (error) => {
          this.showNotification('Error adding product: ' + error.message, 'error');
        }
      });
    } else {
      this.markFormGroupTouched(this.productForm);
    }
  }
  
  cancel(): void {
    this.router.navigate(['/products']);
  }
  
  // Helper method to mark all controls as touched
  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
  
  showNotification(message: string, type: 'success' | 'error'): void {
    this.notification = { message, type };
    setTimeout(() => {
      this.notification = null;
    }, 3000);
  }
}
