import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { CartItem } from "../../interfaces/cartItem";
import { AuthService } from "src/app/auth/auth.service";
import { WishlistService } from "./wishlist.service";
import { FirebaseService } from "src/app/firebaseService/firebase.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-wishlist",
  templateUrl: "./wish-list.component.html",
  styleUrls: ["./wish-list.component.css"],
})
export class WishlistComponent implements OnInit, OnDestroy {
  wishlistItems: CartItem[] = [];
  private wishlistItemsSubscription: Subscription = new Subscription();

  constructor(
    private authService: AuthService,
    public wishlistService: WishlistService,
    private firebaseService: FirebaseService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.wishlistItemsSubscription = this.authService
      .getUserWishlist()
      .subscribe((items: CartItem[]) => {
        if (!items) {
          this.wishlistItems = [];
        } else {
          this.wishlistItems = this.firebaseService.setIds(
            Object.values(items),
            Object.keys(items)
          );

          this.wishlistItems.forEach((item) => {
            this.wishlistService
              .isProductInCart(item.productId)
              .subscribe((isInCart) => {
                item.isProductInCart = isInCart;
              });
          });
        }
      });
  }

  ngOnDestroy(): void {
    this.wishlistItemsSubscription.unsubscribe();
  }

  removeFromWishlist(item: CartItem, confirmDelete: string) {
    if (confirmDelete === "true") {
      const confirmation = window.confirm(
        "Are you sure you want to delete this item?"
      );
      if (confirmation) {
        this.wishlistService.removeFromWishlist(item._id).subscribe(() => {
          this.wishlistItems = this.wishlistItems.filter(
            (i) => i._id !== item._id
          );
        });
      }
    } else {
      this.wishlistService.removeFromWishlist(item._id).subscribe(() => {
        this.wishlistItems = this.wishlistItems.filter(
          (i) => i._id !== item._id
        );
      });
    }
  }

  moveToCart(item: CartItem) {
    this.authService.addToCart(item).subscribe(() => {
      this.removeFromWishlist(item, "false");
    });

    const confirmation = window.confirm(
      "Item added to cart. Would you like to go there?"
    );
    if (confirmation) {
      this.router.navigate(["/cart"]);
    }
  }
}
