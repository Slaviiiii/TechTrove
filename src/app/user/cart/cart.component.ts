import { Component, OnInit } from "@angular/core";
import { CartService } from "./cart.service";
import { AuthService } from "src/app/auth/auth.service";
import { CartItem } from "../../interfaces/cartItem";

@Component({
  selector: "app-cart",
  templateUrl: "./cart.component.html",
  styleUrls: ["./cart.component.css"],
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];

  constructor(
    private cartService: CartService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.getCurrentUserCart().subscribe((items: CartItem[]) => {
      this.cartItems = Object.values(items);
    });
  }

  removeFromCart(item: CartItem): void {
    this.cartService.removeFromCart(item);
  }

  getTotalAmount(): number {
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
