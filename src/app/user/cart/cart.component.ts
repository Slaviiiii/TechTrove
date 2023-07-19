import { Component } from "@angular/core";
import { Router } from "@angular/router";

import { Product } from "src/app/interfaces/product";
import { AuthService } from "../services/auth.service";
import { CartService } from "../services/cart.service";

@Component({
  selector: "app-cart",
  templateUrl: "./cart.component.html",
  styleUrls: ["./cart.component.css"],
})
export class CartComponent {
  cartItems: Product[] = [];
  address: string = "";
  paymentMethod: string = "credit_card";
  checkoutCompleted = false;
  insufficientBalance = false;

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private router: Router
  ) {
    this.cartItems = this.cartService.getCartItems();
  }

  removeFromCart(item: Product): void {
    this.cartService.removeFromCart(item);
  }

  getTotalAmount(): number {
    return this.cartItems.reduce((total, item) => total + item.price, 0);
  }

  //   checkout(): void {
  //     const totalAmount = this.getTotalAmount();
  //     const currentUser = this.authService.getCurrentUser();

  //     if (currentUser && currentUser.balance >= totalAmount) {
  //       currentUser.balance -= totalAmount;
  //       this.cartService.clearCart();
  //       this.checkoutCompleted = true;
  //       this.insufficientBalance = false;
  //     } else {
  //       this.insufficientBalance = true;
  //       this.router.navigate(["/profile"]);
  //     }
  //   }
}
