import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { PlpComponent } from './pages/plp/plp.component';
import { PdpComponent } from './pages/pdp/pdp.component';
import { CartComponent } from './pages/cart/cart.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'plp', component: PlpComponent },
    { path: 'product/:id', component: PdpComponent },
    { path: 'cart', component: CartComponent },
    { path: '**', redirectTo: '' }
];
