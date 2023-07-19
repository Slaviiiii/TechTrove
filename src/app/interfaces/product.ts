export interface Product {
  id: string | undefined;
  name: string;
  price: number;
  promotion?: number;
  from: string;
  shipping: number;
  type: string;
  img: string;
  description: string;
  userId: string;
  created_at: string;
  updatedAt: string;
  __v: number;
}
