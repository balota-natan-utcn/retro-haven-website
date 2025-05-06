export interface Product
{
  id?: number;
  title: string;
  image: string;
  rating: number;
  oldPrice: number;
  currentPrice: number;
  discount: number;
  isSealed: boolean;
  console: string;
  images: ProductImages[];
  description: string[];
}
export interface ProductImages
{
  imageId: number;
  src: string;
  alt: string;
}