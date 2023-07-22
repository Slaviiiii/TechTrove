import { Injectable } from "@angular/core";
import { Product } from "../../interfaces/product";

@Injectable({
  providedIn: "root",
})
export class CartService {
  private cartItems: Product[] = [];

  constructor() {}

  getCartItems(): Product[] {
    return this.cartItems;
  }

  addToCart(item: Product): void {
    this.cartItems.push(item);
  }

  removeFromCart(item: Product): void {
    const index = this.cartItems.indexOf(item);
    if (index > -1) {
      this.cartItems.splice(index, 1);
    }
  }

  clearCart(): void {
    this.cartItems = [];
  }
}
