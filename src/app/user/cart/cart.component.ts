import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { CartService } from "./cart.service";
import { AuthService } from "src/app/auth/auth.service";
import { CartItem } from "../../interfaces/cartItem";

@Component({
  selector: "app-cart",
  templateUrl: "./cart.component.html",
  styleUrls: ["./cart.component.css"],
})
export class CartComponent implements OnInit, OnDestroy {
  cartItems: CartItem[] = [];
  private cartItemsSubscription: Subscription = new Subscription();

  constructor(
    private cartService: CartService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.cartItemsSubscription = this.authService
      .getCurrentUserCart()
      .subscribe((items: CartItem[]) => {
        this.cartItems = Object.values(items);
        this.cartItems.map((i) => (i.quantity = 1));
      });
  }

  ngOnDestroy(): void {
    this.cartItemsSubscription.unsubscribe();
  }

  removeFromCart(item: CartItem): void {
    this.cartService.removeFromCart(item);
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
    this.cartService.clearCart();
  }

  checkout(): void {
    alert("Checkout completed! Thank you for your order.");
  }
}
