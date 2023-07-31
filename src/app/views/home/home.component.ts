import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { Product } from "../../interfaces/product";
import { AuthService } from "src/app/auth/auth.service";
import { FirebaseService } from "src/app/firebaseService/firebase.service";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit, OnDestroy {
  promotions: any = [];
  isLoading: boolean = true;
  private productsSubscription: Subscription = new Subscription();

  constructor(
    public firebaseService: FirebaseService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.productsSubscription = this.firebaseService.getProducts().subscribe({
      next: (products: Product[]) => {
        this.promotions = this.firebaseService.getArrayValues(products);

        this.promotions = this.promotions
          .filter((x: Product) => x.promotion)
          .slice(0, this.promotions.length);
        this.isLoading = false;
      },
      error: (err: any) => {
        this.isLoading = false;
        console.error("Error:", err);
      },
    });
  }

  ngOnDestroy(): void {
    this.productsSubscription.unsubscribe();
  }
}
