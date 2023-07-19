import { Component, OnInit } from "@angular/core";
import { FirebaseService } from "../../firebaseService/firebase.service";
import { Product } from "../../interfaces/product";

@Component({
  selector: "app-products",
  templateUrl: "./products.component.html",
  styleUrls: ["./products.component.css"],
})
export class ProductsComponent implements OnInit {
  searchError: string = "";
  error: boolean = false;
  isLoading: boolean = true;
  selectedCategory: string = "all";
  selectedSecondCategory: string = "all";
  selectedThirdCategory: string = "all";
  array: any = [];
  fetchedProducts: Product[] = [];

  constructor(public firebaseService: FirebaseService) {}

  ngOnInit(): void {
    this.firebaseService.getProducts().subscribe({
      next: (products: Product[]) => {
        this.fetchedProducts = products;
        this.updateFilteredArray();
        this.isLoading = false;
      },
      error: (err: any) => {
        this.isLoading = false;
        console.error("Error:", err);
      },
    });
  }

  selectCategory(event: Event, category: string) {
    event.preventDefault();
    this.selectedCategory = category;
    this.filterProducts();
  }

  selectSecondCategory(event: Event, category: string) {
    event.preventDefault();
    this.selectedSecondCategory = category;
    this.filterProducts();
  }

  selectThirdCategory(event: Event, category: string) {
    event.preventDefault();
    this.selectedThirdCategory = category;
    this.filterProducts();
  }

  onSearchChange(event: any): void {
    const value = event.target.value;
    this.searchError = "";
    this.filterProducts();

    if (value) {
      this.array = this.array.filter((x: Product) =>
        x.name.toLowerCase().includes(value.toLowerCase())
      );

      if (this.array.length === 0) {
        this.searchError = "Could not find what you were looking for!";
      }
    }
  }

  private filterProducts(): void {
    this.updateFilteredArray();

    switch (this.selectedCategory) {
      case "all":
        break;
      case "- $300":
        this.array = this.array.filter(
          (x: Product) =>
            this.getDiscountedPrice(x) <= 300 &&
            this.getDiscountedPrice(x) > 100
        );
        break;
      case "- $500":
        this.array = this.array.filter(
          (x: Product) =>
            this.getDiscountedPrice(x) <= 500 &&
            this.getDiscountedPrice(x) > 300
        );
        break;
      case "- $1000":
        this.array = this.array.filter(
          (x: Product) =>
            this.getDiscountedPrice(x) <= 1000 &&
            this.getDiscountedPrice(x) > 500
        );
        break;
      case "above $1000":
        this.array = this.array.filter(
          (x: Product) => this.getDiscountedPrice(x) > 1000
        );
        break;
      default:
        break;
    }

    switch (this.selectedSecondCategory) {
      case "all":
        break;
      case "Free shipping":
        this.array = this.array.filter((x: Product) => x.shipping === 0);
        break;
      case "Promotions":
        this.array = this.array.filter((x: Product) => x.promotion);
        break;
      default:
        break;
    }

    switch (this.selectedThirdCategory) {
      case "all":
        break;
      case "Phones":
        this.array = this.array.filter((x: Product) => x.type === "Phones");
        break;
      case "Tablets":
        this.array = this.array.filter((x: Product) => x.type === "Tablets");
        break;
      case "Computers":
        this.array = this.array.filter((x: Product) => x.type === "Computers");
        break;
      case "TVs":
        this.array = this.array.filter((x: Product) => x.type === "TVs");
        break;
      default:
        break;
    }
  }

  private updateFilteredArray(): void {
    this.array = Object.values(this.fetchedProducts);
  }

  private getDiscountedPrice(product: Product): number {
    if (product.promotion) {
      const discount = product.price * (product.promotion / 100);
      return product.price - discount;
    } else {
      return product.price;
    }
  }
}
