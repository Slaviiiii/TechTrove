import { CartItem } from "./cartItem";

export interface User {
  username: string;
  email: string;
  password: string;
  country: string;
  balance: number;
  name: string;
  surname: string;
  address: string;
  _id: string;
  cart: CartItem[];
  wishlist: CartItem[];
}
