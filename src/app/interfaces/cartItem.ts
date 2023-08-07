export interface CartItem {
  stock: number;
  _id: string;
  name: string;
  price: number;
  promotion: number;
  from: string;
  shipping: number;
  type: string;
  imgs: string[];
  description: string;
  quantity: number;
  checked: boolean;
  productId: string;
  isProductInCart?: Object;
  isProductInWishlist?: Object;
  reviews: Object;
  saves: number;
}
