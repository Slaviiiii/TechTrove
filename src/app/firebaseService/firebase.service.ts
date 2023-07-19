import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Product } from "../interfaces/product";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class FirebaseService {
  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(
      `${environment.firebaseConfig.databaseURL}/products.json`
    );
  }

  getArrayValues(products: Product[], ids: string[]): Product[] {
    for (let product of products) {
      product.id = ids.shift();
    }
    return products;
  }
}
