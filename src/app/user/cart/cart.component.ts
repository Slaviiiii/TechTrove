import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { CartService } from "./cart.service";
import { AuthService } from "src/app/auth/auth.service";
import { CartItem } from "../../interfaces/cartItem";
import { FirebaseService } from "src/app/firebaseService/firebase.service";
import { Router } from "@angular/router";
import { WishlistService } from "../wish-list/wishlist.service";

@Component({
  selector: "app-cart",
  templateUrl: "./cart.component.html",
  styleUrls: ["./cart.component.css"],
})
export class CartComponent implements OnInit, OnDestroy {
  cartItems: CartItem[] = [];
  private cartItemsSubscription: Subscription = new Subscription();
  private cartChangedSubscription: Subscription = new Subscription();
  selectAllItems: boolean = false;
  isSpinnerOn: boolean = false;
  isSpinnerAtQuantity: boolean = false;
  totalPrice: number = 0;

  constructor(
    public cartService: CartService,
    public wishlistService: WishlistService,
    private authService: AuthService,
    private firebaseService: FirebaseService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isSpinnerOn = true;
    this.cartItemsSubscription = this.authService
      .getCurrentUserCart()
      .subscribe((items: CartItem[]) => {
        if (items === null) {
          this.isSpinnerOn = false;
          this.cartItems = [];
        } else {
          this.isSpinnerOn = false;
          this.cartItems = this.firebaseService.setIds(
            Object.values(items),
            Object.keys(items)
          );

          this.cartItems.forEach((item) => {
            this.wishlistService
              .isProductInWishlist(item.productId)
              .subscribe((isInWishlist) => {
                item.isProductInWishlist = isInWishlist;
              });
          });
        }
      });

    this.cartChangedSubscription =
      this.authService.cartChangedSubject.subscribe(() => {
        this.getCartItems();
        this.calculateSelectedTotal();
      });
  }

  ngOnDestroy(): void {
    this.cartItemsSubscription.unsubscribe();
    this.cartChangedSubscription.unsubscribe();
  }

  addToWishlist(item: CartItem) {
    this.wishlistService.addToWishlist(item).subscribe(
      () => {
        console.log("Product added to wishlist successfully!");
        this.wishlistService
          .isProductInWishlist(item.productId)
          .subscribe((isInWishlist) => {
            item.isProductInWishlist = isInWishlist;
          });
      },
      (error: any) => {
        console.error("Error adding product to wishlist:", error);
      }
    );
  }

  removeFromCart(item: CartItem) {
    this.cartService.removeFromCart(item).subscribe(() => {
      this.authService.cartChangedSubject.next();
    });
  }

  decreaseQuantity(item: CartItem) {
    if (item.quantity > 1) {
      this.isSpinnerAtQuantity = true;
      item.quantity -= 1;
      this.authService
        .updateProductInCollection(item.productId, item)
        .subscribe(() => {
          this.authService.updateCartItem(item).subscribe(() => {
            this.isSpinnerAtQuantity = false;
            this.authService.cartChangedSubject.next();
            this.calculateSelectedTotal();
          });
        });
    }
  }

  increaseQuantity(item: CartItem) {
    if (item.quantity + 1 > item.stock) {
      return;
    }
    this.isSpinnerAtQuantity = true;
    item.quantity += 1;
    this.authService
      .updateProductInCollection(item.productId, item)
      .subscribe(() => {
        this.authService.updateCartItem(item).subscribe(() => {
          this.isSpinnerAtQuantity = false;
          this.authService.cartChangedSubject.next();
          this.calculateSelectedTotal();
        });
      });
  }

  getItemTotal(item: CartItem): number {
    return item.price + item.shipping - (item.price * item.promotion) / 100;
  }

  getItemSubtotal(item: CartItem): number {
    return this.getItemTotal(item) * item.quantity;
  }

  getTotalAmount(): number {
    if (
      this.cartItems.filter((i) => i.quantity >= 1).length <
      this.cartItems.length
    ) {
      return 0;
    }
    return this.cartItems.reduce((total, item) => {
      return total + this.getItemSubtotal(item);
    }, 0);
  }

  clearCart(): void {
    this.cartService.clearCart().subscribe(() => {
      this.authService.cartChangedSubject.next();
    });
  }

  onConfirm() {
    this.router.navigate(["/confirm"]);
  }

  private getCartItems() {
    this.authService.getCurrentUserCart().subscribe((cartItems: CartItem[]) => {
      if (cartItems === null) {
        this.cartItems = [];
      } else {
        this.cartItems = this.firebaseService.setIds(
          Object.values(cartItems),
          Object.keys(cartItems)
        );
      }
    });
  }

  calculateSelectedTotal(): number {
    this.totalPrice = this.cartItems.reduce((total, item) => {
      return total + (item.checked ? this.getItemSubtotal(item) : 0);
    }, 0);
    return this.totalPrice;
  }

  onSelectAllItemsChange(): void {
    this.cartItems.forEach((item) => (item.checked = this.selectAllItems));
    this.calculateSelectedTotal();
  }

  onItemCheckboxChange(): void {
    this.calculateSelectedTotal();
  }

  isProductInWishlist(item: CartItem): any {
    return this.wishlistService.isProductInWishlist(item.productId);
  }
}
