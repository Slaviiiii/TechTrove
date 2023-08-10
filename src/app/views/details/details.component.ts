import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { FirebaseService } from "src/app/firebaseService/firebase.service";
import { CartItem } from "src/app/interfaces/cartItem";
import { AuthService } from "src/app/auth/auth.service";
import { Subscription } from "rxjs";
import { CartService } from "src/app/user/cart/cart.service";
import { WishlistService } from "../../user/wish-list/wishlist.service";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";

@Component({
  selector: "app-details",
  templateUrl: "./details.component.html",
  styleUrls: ["./details.component.css"],
})
export class DetailsComponent implements OnInit, OnDestroy {
  product!: CartItem;
  currentUser: any = {};
  reviews: any = [];
  selectedImageIndex = 0;
  isProductInCart: boolean = false;
  isProductInWishList: boolean = false;
  editedReviewIndex: number = -1;
  private wishlistChangedSubscription: Subscription = new Subscription();
  private userSubscription: Subscription = new Subscription();

  showReviewPopup: boolean = false;

  reviewData: any = {
    rating: 0,
    reviewText: "",
    reviewImage: null,
    showOptions: false,
    id: "",
  };

  showEditReviewPopup: boolean = false;
  editedReview: any = {
    rating: this.reviewData.rating,
    reviewText: this.reviewData.reviewText,
    reviewImage: this.reviewData.reviewImage,
    showOptions: this.reviewData.showOptions,
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
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {
    this.fetchProductDetails();
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
    this.wishlistChangedSubscription.unsubscribe();
  }

  private fetchProductDetails() {
    this.userSubscription = this.authService
      .getCurrentUser()
      .subscribe((user) => {
        if (user) {
          this.currentUser = user;
        } else {
          this.currentUser = {};
        }

        const bought = this.currentUser.bought;
        if (bought) {
          this.currentUser.bought = Object.keys(this.currentUser.bought);
        } else {
          this.currentUser.bought = [];
        }

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
                this.reviews = this.firebaseService.setIds(
                  Object.values(this.product.reviews),
                  Object.keys(this.product.reviews)
                );
                console.log(this.reviews);
              } else {
                this.reviews = [];
              }

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
                    const existingWishlistItem = Object.values(
                      wishlistItems
                    ).find(
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

  setSelectedImage(index: number) {
    this.selectedImageIndex = index;
  }

  addToCart() {
    if (this.product) {
      this.cartService.addToCart(this.product).subscribe(
        () => {
          this.isProductInCart = true;
          this.product.isProductInCart = true;
        },
        (error: any) => {
          console.error("Error adding product to cart:", error);
        }
      );
    }
    const addToCartConfirmation = confirm(
      "Product added to cart. Would you like to visit your cart?"
    );
    if (addToCartConfirmation) {
      this.router.navigate(["/cart"]);
    }
    this.fetchProductDetails();
  }

  addToWishlist() {
    if (this.product) {
      this.wishlistService.addToWishlist(this.product).subscribe(
        () => {
          this.isProductInWishList = true;
        },
        (error: any) => {
          console.error("Error adding product to wishlist:", error);
        }
      );
    }
    const addToWishlistConfirmation = confirm(
      "Product added to wishlist. Would you like to visit your wishlist?"
    );
    if (addToWishlistConfirmation) {
      this.router.navigate(["/wishlist"]);
    }
    this.fetchProductDetails();
  }

  showReviewOptions(review: any) {
    review.showOptions = !review.showOptions;
  }

  openReviewPopup() {
    this.reviewData = {
      rating: 0,
      reviewText: "",
      reviewImage: null,
      showOptions: false,
      _id: "",
    };
    this.rating = 0;
    this.showReviewPopup = true;
  }

  closePopup() {
    this.showReviewPopup = false;
    this.reviewData = {
      rating: 0,
      reviewText: "",
      reviewImage: null,
      showOptions: false,
      _id: "",
    };
    this.rating = 0;
    this.ratingError = false;
    this.imageError = false;
  }

  setRating(rating: number) {
    this.rating = rating;
    this.reviewData.rating = rating;
    this.ratingError = false;
  }

  toggleReviews() {
    this.showReviews = !this.showReviews;
  }

  submitReview() {
    if (this.rating === 0) {
      this.ratingError = true;
      return;
    }

    if (
      this.reviewData.reviewText.length < 5 ||
      this.reviewData.reviewText.length > 170
    ) {
      this.ratingError = false;
      this.imageError = false;
      return;
    }

    if (!this.reviewData.reviewImage) {
      this.imageError = true;
      return;
    }

    const userId = this.authService.getUserId();

    const review = {
      rating: this.reviewData.rating,
      reviewText: this.reviewData.reviewText,
      reviewImage: this.reviewData.reviewImage,
      writtenBy: this.currentUser.username,
      ownerId: userId,
    };

    this.http
      .post<any>(
        `${environment.firebaseConfig.databaseURL}/products/${this.product.productId}/reviews.json`,
        review
      )
      .subscribe(
        () => {
          console.log("Review added to the database successfully!");
          this.fetchProductDetails();
          this.reviews.push(review);
          this.closePopup();
        },
        (error) => {
          console.error("Error adding review to the database:", error);
        }
      );
  }

  handleImageUpload(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.reviewData.reviewImage = e.target.result;
        this.editedReview.reviewImage = this.reviewData.reviewImage;
        this.imageError = false;
      };
      reader.readAsDataURL(file);
    }
  }

  deleteReview(review: any) {
    const confirmation = window.confirm(
      "Are you sure you want to delete this review?"
    );

    if (confirmation) {
      this.http
        .delete<any>(
          `${environment.firebaseConfig.databaseURL}/products/${this.product.productId}/reviews/${review._id}.json`
        )
        .subscribe(
          () => {
            console.log("Review deleted from the database successfully!");

            const index = this.reviews.findIndex(
              (r: any) => r._id === review._id
            );

            if (index !== -1) {
              this.reviews.splice(index, 1);
            }

            this.closePopup();
          },
          (error) => {
            console.error("Error deleting review from the database:", error);
          }
        );
    }

    this.reviewData.showOptions = false;
    this.fetchProductDetails();
  }

  closeEditPopup() {
    this.showEditReviewPopup = false;
    this.editedReview = {
      rating: this.reviewData.rating,
      reviewText: this.reviewData.reviewText,
      reviewImage: this.reviewData.reviewImage,
      showOptions: this.reviewData.showOptions,
      _id: this.reviewData._id,
    };
    this.ratingError = false;
    this.imageError = false;
  }

  setEditRating(rating: number) {
    this.editedReview.rating = rating;
    this.ratingError = false;
  }

  editReview(review: any) {
    this.editedReview = {
      rating: review.rating,
      reviewText: review.reviewText,
      reviewImage: review.reviewImage,
      showOptions: review.showOptions,
      _id: review._id,
    };
    this.showEditReviewPopup = true;
  }

  updateReview() {
    this.fetchProductDetails();
    if (this.editedReview.rating === 0) {
      this.ratingError = true;
      return;
    }

    if (
      this.editedReview.reviewText.length < 5 ||
      this.editedReview.reviewText.length > 170
    ) {
      this.ratingError = false;
      this.imageError = false;
      return;
    }

    if (!this.editedReview.reviewImage) {
      this.imageError = true;
      return;
    }

    const userId = this.authService.getUserId();

    const updatedReview = {
      rating: this.editedReview.rating,
      reviewText: this.editedReview.reviewText,
      reviewImage: this.editedReview.reviewImage,
      writtenBy: this.currentUser.username,
      ownerId: userId,
    };

    const reviewId = this.editedReview._id;

    if (reviewId) {
      this.http
        .put<any>(
          `${environment.firebaseConfig.databaseURL}/products/${this.product.productId}/reviews/${reviewId}.json`,
          updatedReview
        )
        .subscribe(
          () => {
            const updatedIndex = this.reviews.findIndex(
              (r: any) => r._id === reviewId
            );
            if (updatedIndex !== -1) {
              this.reviews[updatedIndex] = updatedReview;
            }
            this.closeEditPopup();
          },
          (error) => {
            console.error("Error updating review in the database:", error);
          }
        );
    } else {
      console.error("Review key not found.");
    }
    this.fetchProductDetails();
  }
}
