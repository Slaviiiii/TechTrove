import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { CartService } from "./cart.service";
import { AuthService } from "src/app/auth/auth.service";
import { CartItem } from "../../interfaces/cartItem";
import { FirebaseService } from "src/app/firebaseService/firebase.service";

@Component({
  selector: "app-cart",
  templateUrl: "./cart.component.html",
  styleUrls: ["./cart.component.css"],
})
export class CartComponent implements OnInit, OnDestroy {
  cartItems: CartItem[] = [];
  private cartItemsSubscription: Subscription = new Subscription();
  private cartChangedSubscription: Subscription = new Subscription();

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private firebaseService: FirebaseService
  ) {}

  ngOnInit(): void {
    this.cartItemsSubscription = this.authService
      .getCurrentUserCart()
      .subscribe((items: CartItem[]) => {
        if (items === null) {
          this.cartItems = [];
        } else {
          this.cartItems = this.firebaseService.setIds(
            Object.values(items),
            Object.keys(items)
          );
        }
      });

    this.cartChangedSubscription =
      this.authService.cartChangedSubject.subscribe(() => {
        this.getCartItems();
      });
  }

  ngOnDestroy(): void {
    this.cartItemsSubscription.unsubscribe();
    this.cartChangedSubscription.unsubscribe();
  }

  removeFromCart(item: CartItem) {
    this.cartService.removeFromCart(item).subscribe((res) => {
      if (res === null) {
        this.authService.cartChangedSubject.next();
        console.log("after next");
      }
    });
  }

  getTotalAmount(): number {
    if (
      this.cartItems.filter((i) => i.quantity >= 1).length <
      this.cartItems.length
    ) {
      return 0;
    }
    return this.cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  }

  clearCart(): void {
    this.cartService.clearCart().subscribe(() => {
      this.authService.cartChangedSubject.next();
    });
  }

  checkout(): void {
    alert("Checkout completed! Thank you for your order.");
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
}
