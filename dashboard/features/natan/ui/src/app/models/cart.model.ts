import { Product } from '../utils/data.models';

export interface CartItem
{
  product: Product;
  quantity: number;
}
