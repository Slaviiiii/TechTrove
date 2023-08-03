import { Injectable } from "@angular/core";
import { AuthService } from "src/app/auth/auth.service";
import { Observable, concatMap, forkJoin, switchMap, tap } from "rxjs";
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

  clearCart(): any {
    return this.authService.getCurrentUserCart().pipe(
      switchMap((cartItems: CartItem[]) => {
        const productUpdates: Observable<void>[] = [];

        Object.values(cartItems).forEach((item) => {
          const productId = item.productId;
          const updatedStock = item.stock + item.quantity;

          const productUpdate$ = this.getProduct(productId).pipe(
            switchMap((product: { stock: number }) => {
              product.stock = updatedStock;
              return this.authService.updateProductInCollection(
                productId,
                product
              );
            })
          );

          productUpdates.push(productUpdate$);
        });

        return forkJoin(productUpdates).pipe(
          concatMap(() =>
            this.authService
              .clearCart()
              .pipe(tap(() => this.authService.cartChangedSubject.next()))
          )
        );
      })
    );
  }

  getSubtotal(cartItems: CartItem[]): number {
    let subtotal = 0;

    for (const item of cartItems) {
      const itemTotal = item.price + item.shipping;
      subtotal += itemTotal;
    }

    return subtotal;
  }

  getTotalShipping(cartItems: CartItem[]): number {
    let totalShipping = 0;

    for (const item of cartItems) {
      totalShipping += item.shipping;
    }

    return totalShipping;
  }

  getProduct(productId: string): Observable<any> {
    return this.authService.getProduct(productId);
  }
}
