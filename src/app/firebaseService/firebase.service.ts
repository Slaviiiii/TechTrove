import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Product } from "../interfaces/product";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";
import { AngularFireDatabase } from "@angular/fire/compat/database";

@Injectable({
  providedIn: "root",
})
export class FirebaseService {
  constructor(private http: HttpClient, private afDb: AngularFireDatabase) {}

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(
      `${environment.firebaseConfig.databaseURL}/products.json`
    );
  }

  async setProductid(product: any): Promise<any> {
    const productRef = this.afDb.database.ref("products").push();
    const productId = productRef.key;

    await productRef.set({ ...product, _id: productId });

    return { ...product, _id: productId };
  }

  async addProductToExistingOnes(product: any): Promise<any> {
    try {
      const newProduct = await this.setProductid(product);

      const productId = newProduct._id;
      const productRef = this.afDb.database.ref(`products/${productId}`);

      const snapshot = await productRef.once("value");
      if (snapshot.exists()) {
        throw new Error("Product with the same ID already exists.");
      }

      await productRef.set(newProduct);

      return newProduct;
    } catch (error) {
      console.error("Error adding product to existing ones:", error);
      throw error;
    }
  }

  getArrayValues(products: Product[], ids: string[]): Product[] {
    for (let product of products) {
      product.id = ids.shift();
    }
    return products;
  }
}
