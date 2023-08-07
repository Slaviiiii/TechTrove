import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { FirebaseService } from "src/app/firebaseService/firebase.service";
import { CartItem } from "src/app/interfaces/cartItem";
import { AuthService } from "src/app/auth/auth.service";
import { Subscription } from "rxjs";
import { User } from "../../interfaces/user";
import { CartService } from "src/app/user/cart/cart.service";
import { WishlistService } from "../../user/wish-list/wishlist.service";
import { AngularFireDatabase } from "@angular/fire/compat/database";

@Component({
  selector: "app-details",
  templateUrl: "./details.component.html",
  styleUrls: ["./details.component.css"],
})
export class DetailsComponent implements OnInit, OnDestroy {
  product!: CartItem;
  currentUser!: User;
  reviews: any = [];
  selectedImageIndex = 0;
  isProductInCart: boolean = false;
  isProductInWishList: boolean = false;
  private wishlistChangedSubscription: Subscription = new Subscription();
  private userSubscription: Subscription = new Subscription();

  showReviewPopup: boolean = false;

  reviewData: any = {
    rating: 0,
    reviewText: "",
    reviewImage: null,
  };

  rating: number = 0;
  stars: number[] = [1, 2, 3, 4, 5];
  ratingError: boolean = false;
  imageError: boolean = false;

  showReviews: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private firebaseService: FirebaseService,
    public cartService: CartService,
    private wishlistService: WishlistService,
    public authService: AuthService,
    private afDB: AngularFireDatabase
  ) {}

  ngOnInit() {
    this.userSubscription = this.authService
      .getCurrentUser()
      .subscribe((user) => {
        this.currentUser = user;
        this.currentUser.bought = Object.keys(this.currentUser.bought);
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

              if (product.reviews) {
                this.reviews = Object.values(product?.reviews);
              } else {
                this.reviews = [];
              }

              this.authService
                .getCurrentUserCart()
                .subscribe((cartItems: CartItem[]) => {
                  if (!cartItems) {
                    this.isProductInCart = false;
                  } else {
                    const existingCartItem = cartItems.find(
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
                    const existingWishlistItem = wishlistItems.find(
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
                  const existingWishlistItem = wishlistItems.find(
                    (wishlistItem) => wishlistItem._id === this.product._id
                  );
                  this.isProductInWishList = !!existingWishlistItem;
                }
              });
          });
      });
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
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

  openReviewPopup() {
    this.showReviewPopup = true;
  }

  closePopup() {
    this.showReviewPopup = false;
    this.reviewData = {
      rating: 0,
      reviewText: "",
      reviewImage: null,
    };

    this.rating = 0;
    this.ratingError = false;
    this.imageError = false;
  }

  setRating(rating: number) {
    this.rating = rating;
    this.ratingError = false;
  }

  toggleReviews() {
    this.showReviews = !this.showReviews;
  }

  openReviewOptions(review: any) {
    review.showOptions = !review.showOptions;
  }

  submitReview() {
    if (this.rating === 0) {
      this.ratingError = true;
      return;
    }

    this.reviewData.rating = this.rating;

    if (
      this.reviewData.reviewText.length < 5 ||
      this.reviewData.reviewText.length > 100
    ) {
      this.ratingError = false;
      this.imageError = false;
      return;
    }
    if (!this.reviewData.reviewImage) {
      this.imageError = true;
      return;
    }

    const review = {
      rating: this.reviewData.rating,
      reviewText: this.reviewData.reviewText,
      reviewImage: this.reviewData.reviewImage,
      writtenBy: this.currentUser.username,
    };

    const productReviewsRef = this.afDB.list(
      `products/${this.product.productId}/reviews`
    );

    productReviewsRef
      .push(review)
      .then(() => {
        console.log("Review added to the database successfully!");
        this.reviews.push(review);
        this.closePopup();
      })
      .catch((error) => {
        console.error("Error adding review to the database:", error);
      });
  }

  handleImageUpload(event: any) {
    const file = event.target.files[0];

    if (file && file.type.includes("image")) {
      const reader = new FileReader();

      reader.onload = (ev: any) => {
        this.reviewData.reviewImage = ev.target.result;
      };

      reader.readAsDataURL(file);
    }
  }
}
