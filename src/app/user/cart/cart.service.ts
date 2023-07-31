import { Injectable } from "@angular/core";
import { AuthService } from "src/app/auth/auth.service";
import { Observable } from "rxjs";
import { CartItem } from "../../interfaces/cartItem";

@Injectable({
  providedIn: "root",
})
export class CartService {
  constructor(private authService: AuthService) {}

  addToCart(item: CartItem): Observable<void> {
    return this.authService.addToCart(item);
  }

  removeFromCart(item: CartItem): Observable<void> {
    return this.authService.removeFromCart(item._id);
  }

  clearCart(): Observable<void> {
    return this.authService.clearCart();
  }
}
