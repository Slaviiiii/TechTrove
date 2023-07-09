import { Component } from '@angular/core';

@Component({
  selector: 'app-completed-popup',
  templateUrl: './completed-popup.component.html',
  styleUrls: ['./completed-popup.component.css']
})
export class CompletedPopupComponent {
	showPopup: boolean = false;

	closePopup() {
    	this.showPopup = !this.showPopup;
	}
}