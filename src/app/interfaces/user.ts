import { CartItem } from "./cartItem";

export interface User {
  username: string;
  email: string;
  password: string;
  country: string;
  balance: number;
  gender: string;
  profileImage: string;
  address: string;
  _id: string;
  cart: CartItem[];
  products: { [productId: string]: boolean };
}
