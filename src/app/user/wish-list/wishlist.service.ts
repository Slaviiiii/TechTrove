import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, tap } from "rxjs";
import { CartItem } from "../../interfaces/cartItem";
import { AuthService } from "../../auth/auth.service";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class WishlistService {
  public wishlistItemsSubject: BehaviorSubject<CartItem[]> =
    new BehaviorSubject<CartItem[]>([]);
  wishlistItems$ = this.wishlistItemsSubject.asObservable();
  cartItems: CartItem[] = [];

  constructor(private authService: AuthService, public http: HttpClient) {
    this.authService.getCurrentUserCart().subscribe((cartItems: CartItem[]) => {
      this.cartItems = Object.values(cartItems) || [];
    });
  }

  isProductInCart(productId: string): Observable<any> {
    return this.authService.getCurrentUserCart().pipe(
      tap((cartItems: CartItem[] | null) => {
        if (!cartItems || !Array.isArray(cartItems)) {
          return false;
        }
        const isInCart = cartItems.some((item) => item.productId === productId);
        return isInCart;
      })
    );
  }

  isProductInWishlist(productId: string): Observable<any> {
    return this.authService.getCurrentUserWishlist().pipe(
      tap((wishItems: CartItem[] | null) => {
        if (!wishItems || !Array.isArray(wishItems)) {
          return false;
        }

        const isInWishlist = wishItems.some(
          (item) => item.productId === productId
        );
        return isInWishlist;
      })
    );
  }

  addToWishlist(itemData: CartItem): Observable<CartItem> {
    const userId = this.authService.getUserId();
    return this.http
      .post<CartItem>(
        `${environment.firebaseConfig.databaseURL}/users/${userId}/wishlist.json`,
        itemData
      )
      .pipe(
        tap(() => {
          this.wishlistItemsSubject.next([
            ...this.wishlistItemsSubject.value,
            itemData,
          ]);
        })
      );
  }

  removeFromWishlist(itemId: string): Observable<void> {
    const userId = this.authService.getUserId();
    return this.http
      .delete<void>(
        `${environment.firebaseConfig.databaseURL}/users/${userId}/wishlist/${itemId}.json`
      )
      .pipe(
        tap(() => {
          const updatedWishlistItems = this.wishlistItemsSubject.value.filter(
            (item) => item._id !== itemId
          );
          this.wishlistItemsSubject.next(updatedWishlistItems);
        })
      );
  }
}
