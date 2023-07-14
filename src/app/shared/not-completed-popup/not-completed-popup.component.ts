import { Component } from '@angular/core';

@Component({
  selector: 'app-not-completed-popup',
  templateUrl: './not-completed-popup.component.html',
  styleUrls: ['./not-completed-popup.component.css']
})
export class NotCompletedPopupComponent {
  showPopup: boolean = false;

	closePopup() {
    	this.showPopup = !this.showPopup;
	}
}