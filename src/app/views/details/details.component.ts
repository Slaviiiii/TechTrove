import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { AuthService } from "src/app/auth/auth.service";
import { FirebaseService } from "src/app/firebaseService/firebase.service";
import { CartItem } from "src/app/interfaces/cartItem";
import { CartService } from "src/app/user/cart/cart.service";

@Component({
  selector: "app-details",
  templateUrl: "./details.component.html",
  styleUrls: ["./details.component.css"],
})
export class DetailsComponent implements OnInit {
  product!: CartItem;
  selectedImageIndex = 0;
  isProductInCart: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private firebaseService: FirebaseService,
    public cartService: CartService,
    public authService: AuthService
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      const productId = params["id"];
      this.firebaseService
        .getProductById(productId)
        .subscribe((product: any) => {
          this.product = { ...product, quantity: 1 } || {};

          this.authService
            .getCurrentUserCart()
            .subscribe((cartItems: CartItem[]) => {
              const existingItem = cartItems.find(
                (cartItem) => cartItem._id === this.product._id
              );
              this.isProductInCart = !!existingItem;
            });
        });
    });
  }

  setSelectedImage(index: number) {
    this.selectedImageIndex = index;
  }

  addToCart() {
    if (this.product) {
      this.cartService.addToCart(this.product).subscribe(
        () => {
          console.log("Product added to cart successfully!");
          this.isProductInCart = true;
        },
        (error: any) => {
          console.error("Error adding product to cart:", error);
        }
      );
    }
  }
}
