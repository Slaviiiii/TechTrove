import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { AuthService } from "src/app/auth/auth.service";
import { CartItem } from "../../interfaces/cartItem";
import { FirebaseService } from "src/app/firebaseService/firebase.service";
import { Router } from "@angular/router";
import { CartService } from "../cart/cart.service";

@Component({
  selector: "app-confirm",
  templateUrl: "./confirm.component.html",
  styleUrls: ["./confirm.component.css"],
})
export class ConfirmComponent implements OnInit, OnDestroy {
  confirmedItems: CartItem[] = [];
  private confirmedItemsSubscription: Subscription = new Subscription();
  private cartChangedSubscription: Subscription = new Subscription();
  currentUser: any;

  constructor(
    private authService: AuthService,
    private firebaseService: FirebaseService,
    public cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe((user) => {
      if (user) {
        this.currentUser = user;
      } else {
        alert("User information not available");
      }
    });

    this.confirmedItemsSubscription = this.authService
      .getCurrentUserCart()
      .subscribe((items: CartItem[]) => {
        if (!items) {
          this.confirmedItems = [];
        } else {
          this.confirmedItems = this.firebaseService.setIds(
            Object.values(items),
            Object.keys(items)
          );
        }
      });

    this.cartChangedSubscription =
      this.authService.cartChangedSubject.subscribe(() => {
        this.getConfirmedItems();
        this.calculateTotalAmount();
      });
  }

  ngOnDestroy(): void {
    this.confirmedItemsSubscription.unsubscribe();
    this.cartChangedSubscription.unsubscribe();
  }

  getConfirmedItems() {
    this.authService
      .getCurrentUserCart()
      .subscribe((confirmedItems: CartItem[]) => {
        if (!confirmedItems) {
          this.confirmedItems = [];
        } else {
          this.confirmedItems = this.firebaseService.setIds(
            Object.values(confirmedItems),
            Object.keys(confirmedItems)
          );
        }
      });
  }

  async onCompleteOrder() {
    const userId = this.authService.getUserId();

    if (userId) {
      const idsToAddToBought: string[] = this.confirmedItems.map(
        (i) => i.productId
      );

      const userProfile = this.currentUser;

      const updatedBoughtObject = userProfile.bought
        ? { ...userProfile.bought }
        : {};

      idsToAddToBought.forEach((id) => {
        updatedBoughtObject[id] = true;
      });

      this.currentUser.bought = updatedBoughtObject;

      try {
        this.authService.clearCart();
        this.currentUser.balance -= this.calculateTotalAmount();
        await this.authService.updateProfile(this.currentUser).toPromise();

        this.authService.cartChangedSubject.next();

        setTimeout(() => {
          this.router.navigate(["/order-success"]);
        }, 2000);
      } catch (error: any) {
        alert(error.message);
      }
    } else {
      alert("User information not available");
    }
  }

  calculateTotalAmount(): number {
    return this.confirmedItems.reduce((total, item) => {
      const itemTotal = this.getItemTotal(item);
      const subtotal = itemTotal * item.quantity;
      return total + subtotal;
    }, 0);
  }

  getItemTotal(item: CartItem): number {
    const itemTotal = item.price + item.shipping;
    if (item.promotion > 0) {
      return itemTotal - (itemTotal * item.promotion) / 100;
    } else {
      return itemTotal;
    }
  }
}
