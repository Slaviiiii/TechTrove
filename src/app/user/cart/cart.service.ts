import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AuthService } from "src/app/auth/auth.service";
import { Observable, map, switchMap, of } from "rxjs";
import { environment } from "../../../environments/environment";
import { CartItem } from "../../interfaces/cartItem";

@Injectable({
  providedIn: "root",
})
export class CartService {
  constructor(private authService: AuthService, private http: HttpClient) {}

  addToCart(item: CartItem): Observable<void> {
    return this.authService.getCurrentUserCart().pipe(
      switchMap((cartItems: CartItem[]) => {
        const currentItems = cartItems || [];
        const existingItem = currentItems.find((cI) => item._id === cI._id);

        if (!existingItem) {
          currentItems.push(item);
        }

        const userId = this.authService.getUserId();
        return this.http.put<void>(
          `${environment.firebaseConfig.databaseURL}/users/${userId}/cart.json`,
          currentItems
        );
      })
    );
  }

  removeFromCart(item: CartItem): Observable<void> {
    return this.authService.getCurrentUserCart().pipe(
      map((cartItems: CartItem[]) => {
        const currentItems = cartItems || [];
        const updatedItems = currentItems.filter(
          (cartItem) => cartItem._id !== item._id
        );
        return updatedItems;
      }),
      switchMap((updatedItems: CartItem[]) => {
        const userId = this.authService.getUserId();
        return this.http.put<void>(
          `${environment.firebaseConfig.databaseURL}/users/${userId}/cart.json`,
          updatedItems
        );
      })
    );
  }

  clearCart(): Observable<void> {
    const emptyCart: CartItem[] = [];
    const userId = this.authService.getUserId();
    return this.http.put<void>(
      `${environment.firebaseConfig.databaseURL}/users/${userId}/cart.json`,
      emptyCart
    );
  }
}
