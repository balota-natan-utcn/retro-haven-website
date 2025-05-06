import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product, ProductImages } from '../../models/product.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss'],
  imports: [CommonModule, FormsModule, ReactiveFormsModule]
})
export class ProductDetailComponent implements OnInit {
  productId: number = 0;
  product?: Product;
  productForm!: FormGroup;
  notification: { message: string, type: 'success' | 'error' } | null = null;
  productImage: string = '';
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private productService: ProductService
  ) {}
  
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.productId = +params['id']; // Convert to number
      console.log(this.productId);
      this.loadProduct();
    });
    
    // Initialize form with empty values (will be populated when product loads)
    this.initForm();
  }
  
  initForm(product?: Product): void {
    this.productForm = this.fb.group({
      id: [product?.id],
      title: [product?.title || '', [Validators.required]],
      image: [product?.image || '', [Validators.required]],
      rating: [product?.rating || 5, [Validators.required, Validators.min(1), Validators.max(5)]],
      oldPrice: [product?.oldPrice || 0, [Validators.required, Validators.min(0)]],
      currentPrice: [product?.currentPrice || 0, [Validators.required, Validators.min(0)]],
      discount: [product?.discount || 0, [Validators.required, Validators.min(0), Validators.max(100)]],
      isSealed: [product?.isSealed || false],
      console: [product?.console || '', [Validators.required]],
      description: [product?.description || '', [Validators.required]],
      images: this.fb.array([])
    });
    
    // Initialize images FormArray if product has images
    if (product?.images && product.images.length > 0) {
      // Clear existing form array
      this.clearImagesFormArray();
      
      // Add each image to form array
      product.images.forEach(image => {
        this.addExistingImage(image);
      });
    } else {
      // Add at least one empty image form
      this.addImage();
    }
  }
  
  // Getter for easier access to the images FormArray
  get images(): FormArray {
    return this.productForm.get('images') as FormArray;
  }
  
  addImage(): void {
    const newImageId = this.getNextImageId();
    const imageForm = this.fb.group({
      imageId: [newImageId],
      src: ['', [Validators.required]],
      alt: ['', [Validators.required]]
    });
    
    this.images.push(imageForm);
  }
  
  addExistingImage(image: any): void {
    const imageForm = this.fb.group({
      imageId: [image.imageId],
      src: [image.src, [Validators.required]],
      alt: [image.alt, [Validators.required]]
    });
    
    this.images.push(imageForm);
  }
  
  removeImage(index: number): void {
    // Keep at least one image form
    if (this.images.length > 1) {
      this.images.removeAt(index);
    }
  }
  
  clearImagesFormArray(): void {
    while (this.images.length) {
      this.images.removeAt(0);
    }
  }
  
  getNextImageId(): number {
    if (!this.product?.images || this.product.images.length === 0) {
      return 1;
    }
    
    const maxId = Math.max(...this.product.images.map(img => img.imageId));
    return maxId + 1;
  }
  
  loadProduct(): void {
    this.productService.getProductById(this.productId).subscribe({
      next: (product) => {
        if (product) {
          // Save the full image URL for display
          this.productImage = product.image;
  
          // Extract just the image filename for the form
          if (product.image && product.image.includes('/')) {
            product.image = product.image.split('/').pop() || product.image;
          }

          // For product.images array
          if (product.images && Array.isArray(product.images))
          {
            product.images = product.images.map(image =>
            {
              if (image.src && image.src.includes('/'))
              {
                // Create a new object to avoid mutating the original
                return{
                  ...image,
                  src: image.src.split('/').pop() || image.src
                };
              }
            return image;
            });
          }
  
          this.product = product;
          this.initForm(product);
        } else {
          this.showNotification('Product not found', 'error');
          this.router.navigate(['/products']);
        }
      },
      error: (error) => {
        this.showNotification('Error loading product: ' + error.message, 'error');
        this.router.navigate(['/products']);
      }
    });
  }
  
  onSubmit(): void {
    if (this.productForm.valid) {
      this.productService.updateProduct(this.productForm.value).subscribe({
        next: () => {
          this.showNotification('Product updated successfully', 'success');
          this.router.navigate(['/products']);
        },
        error: (error) => {
          this.showNotification('Error updating product: ' + error.message, 'error');
        }
      });
    } else {
      this.markFormGroupTouched(this.productForm);
    }
  }
  
  cancel(): void {
    this.router.navigate(['/products']);
  }
  
  showNotification(message: string, type: 'success' | 'error'): void {
    this.notification = { message, type };
    setTimeout(() => {
      this.notification = null;
    }, 3000);
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
}