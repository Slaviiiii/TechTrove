import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ApiService } from '../api.service';
import { Product } from '../types/product';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  error = false;
  isLoading = true;
  array: Product[] = [];
  fetchedProducts: Product[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.apiService.getProducts().subscribe({
      next: (products: Product[]) => {
        this.fetchedProducts = products;
		this.array = this.fetchedProducts;
		this.array = this.getArrayValues();
        this.isLoading = false;
      },
      error: (err: any) => {
        this.isLoading = false;
        console.error('Error:', err);
      }
    });
  }

  getArrayValues(): Product[] {
    return Object.values(this.array);
  }

  searchHandler(form: NgForm): void {
    const { search } = form.value;
    form.setValue({ search: '' });

	if(search === '') {
		this.array = this.fetchedProducts;
		this.array = this.getArrayValues();
		return;
	}

	this.array = this.array.filter(x => x);
  }
}