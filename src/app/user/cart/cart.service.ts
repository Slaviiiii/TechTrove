import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { CartItem } from "../../interfaces/cartItem";

@Injectable({
  providedIn: "root",
})
export class CartService {
  private cartItemsSubject: BehaviorSubject<CartItem[]> = new BehaviorSubject<
    CartItem[]
  >([]);
  cartItems$: Observable<CartItem[]> = this.cartItemsSubject.asObservable();

  constructor() {}

  addToCart(item: CartItem): void {
    const currentItems = this.cartItemsSubject.getValue();
    const existingItem = currentItems.find(
      (cartItem) => cartItem.id === item.id
    );

    if (existingItem) {
      existingItem.quantity += item.quantity;
    } else {
      currentItems.push(item);
    }

    this.cartItemsSubject.next(currentItems);
  }

  removeFromCart(item: CartItem): void {
    const currentItems = this.cartItemsSubject.getValue();
    const updatedItems = currentItems.filter(
      (cartItem) => cartItem.id !== item.id
    );

    this.cartItemsSubject.next(updatedItems);
  }

  clearCart(): void {
    this.cartItemsSubject.next([]);
  }
}
