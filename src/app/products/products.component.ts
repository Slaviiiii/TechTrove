import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent {
	error: boolean = false;
	array: any = [
		{
			img: "../../assets/apple.jpg",
			name: 'Iphone',
			price: '2100BGN',
			description: 'Small and ease to use phone.'
		},
		{
			img: "../../assets/apple.jpg",
			name: 'Lenovo',
			price: '2100BGN',
			description: 'Small and ease to use phone.'
		},
	];
	fetchedProducts: any = [
		{
			img: "../../assets/apple.jpg",
			name: 'Iphone',
			price: '2100BGN',
			description: 'Small and ease to use phone.'
		},
		{
			img: "../../assets/apple.jpg",
			name: 'Lenovo',
			price: '2100BGN',
			description: 'Small and ease to use phone.'
		},
	];

	searchHandler(form: NgForm): void {
		const value: {search: string} = form.value;
		form.setValue({search: ''});

		if(value.search === '') {
			this.array = this.fetchedProducts;
			return;
		}

		this.array = this.fetchedProducts.filter((x: { img: string, name: string, price: string; }) => x.name.toLowerCase().startsWith(value.search.toLowerCase()));
	}
}