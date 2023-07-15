import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../firebase.service';
import { Product } from '.././types/product';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
	searchError = "";
  	error = false;
	isLoading = true;
	array: Product[] = [];
	fetchedProducts: Product[] = [];

  	constructor(public firebaseService: FirebaseService) {}

  	ngOnInit(): void {
    	this.firebaseService.getProducts().subscribe({
      	next: (products: Product[]) => {
        	this.fetchedProducts = products;
			this.array = this.firebaseService.getArrayValues(this.fetchedProducts);
        	this.isLoading = false;
    	},
      	error: (err: any) => {
        	this.isLoading = false;
        	console.error('Error:', err);
      	}
      });
	}

	  onSearchChange(event: any): void {
		const value = event.target.value;
		let filtered: Product[] = [];
	  
		if (!value) {
			this.array = this.firebaseService.getArrayValues(this.fetchedProducts);
		  return;
		}
	  
		filtered = this.array.filter(x => x.name.toLowerCase().includes(value.toLowerCase()));
	  
		if (filtered.length === 0) {
		  this.searchError = "Could not find what you were looking for!";
		} else {
			this.searchError = "";
			this.array = this.firebaseService.getArrayValues(this.fetchedProducts);
			this.array = this.array.filter(x => x.name.toLowerCase().includes(value.toLowerCase()));
		}
	  }
}