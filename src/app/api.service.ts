import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from './types/product';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
	return this.http.get<Product[]>('https://techtrove-project-default-rtdb.europe-west1.firebasedatabase.app/products.json');
  }
}
