import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "../../auth/auth.service";
import { Subscription } from "rxjs";
import { CartItem } from "src/app/interfaces/cartItem";
import { FirebaseService } from "src/app/firebaseService/firebase.service";

@Component({
  selector: "app-navigation",
  templateUrl: "./navigation.component.html",
  styleUrls: ["./navigation.component.css"],
})
export class NavigationComponent implements OnInit, OnDestroy {
  isBurgerMenuOn: boolean = false;
  isDropDownOn: boolean = false;
  cartItems: CartItem[] = [];
  cartLength: number = 0;
  private cartSubscription: Subscription = new Subscription();
  private userSubscription: Subscription = new Subscription();
  isLoggedIn: boolean = false;

  constructor(
    public authService: AuthService,
    private firebaseService: FirebaseService,
    private router: Router
  ) {}

  ngOnInit() {
    this.cartSubscription = this.authService.cartChangedSubject.subscribe(
      () => {
        this.getCartItems();
      }
    );

    this.userSubscription = this.authService.userStatusChanged.subscribe(
      (isLoggedIn: boolean) => {
        this.isLoggedIn = isLoggedIn;
        if (isLoggedIn) {
          this.getCartItems();
        }
      }
    );
  }

  ngOnDestroy() {
    this.cartSubscription.unsubscribe();
    this.userSubscription.unsubscribe();
  }

  onBurgerClick() {
    if (this.isDropDownOn) {
      this.isDropDownOn = !this.isDropDownOn;
    }
    this.isBurgerMenuOn = !this.isBurgerMenuOn;
  }

  onDropDownClick() {
    if (this.isBurgerMenuOn) {
      this.isBurgerMenuOn = !this.isBurgerMenuOn;
    }
    this.isDropDownOn = !this.isDropDownOn;
  }

  onPageChange(event: Event) {
    event.preventDefault();
    if (this.isDropDownOn) {
      this.isDropDownOn = !this.isDropDownOn;
    } else if (this.isBurgerMenuOn) {
      this.isBurgerMenuOn = !this.isBurgerMenuOn;
    }
  }

  async onLogout(event: Event) {
    event.preventDefault();
    await this.authService.logoutUser();
    this.onPageChange(event);
    this.router.navigate(["/home"]);
    this.cartLength = 0;
  }

  getCartItems() {
    this.authService.getCurrentUserCart().subscribe(
      (cartItems: CartItem[]) => {
        this.cartItems = cartItems;
        this.cartLength = this.firebaseService.getArrayValues(cartItems).length;
      },
      (error: any) => {
        console.error("Error fetching shopping cart:", error);
      }
    );
  }
}
