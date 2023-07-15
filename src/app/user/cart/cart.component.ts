import { Component } from '@angular/core';
import { Product } from 'src/app/types/product';
import { CartService } from '../cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent {
	cartItems: Product[] = [];

	constructor(private cartService: CartService) {
    	this.cartItems = this.cartService.getCartItems();
  	}

  	removeFromCart(item: Product): void {
    	this.cartService.removeFromCart(item);
    	this.cartItems = this.cartService.getCartItems();
  	}

  	checkout(): void {
    	console.log('Checkout completed!');
  	}
}