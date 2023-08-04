import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { AuthService } from "src/app/auth/auth.service";
import { FirebaseService } from "src/app/firebaseService/firebase.service";
import { CartItem } from "src/app/interfaces/cartItem";
import { CartService } from "src/app/user/cart/cart.service";
import { WishlistService } from "src/app/user/wish-list/wishlist.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-details",
  templateUrl: "./details.component.html",
  styleUrls: ["./details.component.css"],
})
export class DetailsComponent implements OnInit, OnDestroy {
  product!: CartItem;
  selectedImageIndex = 0;
  isProductInCart: boolean = false;
  isProductInWishList: boolean = false;
  private wishlistChangedSubscription: Subscription = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private firebaseService: FirebaseService,
    public cartService: CartService,
    private wishlistService: WishlistService,
    public authService: AuthService
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      const productId = params["id"];
      this.firebaseService
        .getProductById(productId)
        .subscribe((product: any) => {
          this.product =
            {
              ...product,
              quantity: 1,
              checked: true,
              productId: productId,
              isProductInCart: this.isProductInCart,
            } || {};

          this.authService
            .getCurrentUserCart()
            .subscribe((cartItems: CartItem[]) => {
              if (!cartItems) {
                this.isProductInCart = false;
              } else {
                const existingCartItem = Object.values(cartItems).find(
                  (cartItem) => cartItem._id === this.product._id
                );
                this.isProductInCart = !!existingCartItem;
              }
            });

          this.authService
            .getUserWishlist()
            .subscribe((wishlistItems: CartItem[]) => {
              if (!wishlistItems) {
                this.isProductInWishList = false;
              } else {
                const existingWishlistItem = Object.values(wishlistItems).find(
                  (wishlistItem) => wishlistItem._id === this.product._id
                );
                this.isProductInWishList = !!existingWishlistItem;
              }
            });
        });
    });

    this.wishlistChangedSubscription =
      this.authService.wishlistChangedSubject.subscribe(() => {
        this.authService
          .getUserWishlist()
          .subscribe((wishlistItems: CartItem[]) => {
            if (!wishlistItems) {
              this.isProductInWishList = false;
            } else {
              const existingWishlistItem = Object.values(wishlistItems).find(
                (wishlistItem) => wishlistItem._id === this.product._id
              );
              this.isProductInWishList = !!existingWishlistItem;
            }
          });
      });
  }

  ngOnDestroy() {
    this.wishlistChangedSubscription.unsubscribe();
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
          this.product.isProductInCart = true;
        },
        (error: any) => {
          console.error("Error adding product to cart:", error);
        }
      );
    }
  }

  addToWishlist() {
    if (this.product) {
      this.wishlistService.addToWishlist(this.product).subscribe(
        () => {
          console.log("Product added to wishlist successfully!");
          this.isProductInWishList = true;
        },
        (error: any) => {
          console.error("Error adding product to wishlist:", error);
        }
      );
    }
  }
}
