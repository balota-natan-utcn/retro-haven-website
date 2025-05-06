import { Component } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { TopMenuComponent } from './shared/top-menu/top-menu.component';
import { CartService } from './services/cart.service';
import { Observable } from 'rxjs';
import { AsyncPipe, CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule, TopMenuComponent, AsyncPipe, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'dan-ui';
  cartItemCount$: Observable<number>;

  constructor(private cartService: CartService) {
    this.cartItemCount$ = this.cartService.getItemCount();
  }
}

