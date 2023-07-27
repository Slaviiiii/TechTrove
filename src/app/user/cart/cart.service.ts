import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { CartItem } from "../../interfaces/cartItem";
import { AuthService } from "src/app/auth/auth.service";
import { Observable, map, switchMap } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class CartService {
  constructor(private authService: AuthService, private http: HttpClient) {}

  addToCart(item: CartItem): Observable<void> {
    return this.authService.getCurrentUserCart().pipe(
      map((cartItems: CartItem[]) => {
        const currentItems = cartItems || [];
        const existingItem = currentItems.find(
          (cartItem) => cartItem.id === item.id
        );

        if (existingItem) {
          existingItem.quantity += item.quantity;
        } else {
          currentItems.push(item);
        }

        return currentItems;
      }),
      switchMap((updatedItems: CartItem[]) => {
        const userId = localStorage.getItem("userId");
        return this.http.put<void>(
          `${environment.firebaseConfig.databaseURL}/users/${userId}/cart.json`,
          updatedItems
        );
      })
    );
  }

  removeFromCart(item: CartItem): Observable<void> {
    return this.authService.getCurrentUserCart().pipe(
      map((cartItems: CartItem[]) => {
        const currentItems = cartItems || [];
        const updatedItems = currentItems.filter(
          (cartItem) => cartItem.id !== item.id
        );
        return updatedItems;
      }),
      switchMap((updatedItems: CartItem[]) => {
        const userId = localStorage.getItem("userId");
        return this.http.put<void>(
          `${environment.firebaseConfig.databaseURL}/users/${userId}/cart.json`,
          updatedItems
        );
      })
    );
  }

  clearCart(): Observable<void> {
    const emptyCart: CartItem[] = [];
    const userId = localStorage.getItem("userId");
    return this.http.put<void>(
      `${environment.firebaseConfig.databaseURL}/users/${userId}/cart.json`,
      emptyCart
    );
  }
}
