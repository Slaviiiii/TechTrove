import { Component, OnInit } from "@angular/core";
import { FirebaseService } from "../firebase.service";
import { Product } from "../types/product";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
  FirebaseService: any;
  promotions: any = [];
  isLoading: boolean = true;

  constructor(public firebaseService: FirebaseService) {}

  ngOnInit(): void {
    this.firebaseService.getProducts().subscribe({
      next: (products: Product[]) => {
        this.promotions = this.firebaseService.getArrayValues(
          Object.values(products),
          Object.keys(products)
        );
        this.promotions
          .filter((x: Product) => x.promotion)
          .slice(0, products.length);
        this.isLoading = false;
      },
      error: (err: any) => {
        this.isLoading = false;
        console.error("Error:", err);
      },
    });
  }
}
