export interface Product {
  id: string | undefined;
  name: string;
  price: number;
  promotion: number;
  from: string;
  shipping: number;
  type: string;
  imgs: string[];
  description: string;
}
