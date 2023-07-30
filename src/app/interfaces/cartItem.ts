export interface CartItem {
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
}
