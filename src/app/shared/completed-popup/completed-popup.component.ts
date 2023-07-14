import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-completed-popup',
  templateUrl: './completed-popup.component.html',
  styleUrls: ['./completed-popup.component.css']
})
export class CompletedPopupComponent {
	@Input() message: string | undefined;
	showPopup: boolean = true;

	closePopup() {
    	this.showPopup = !this.showPopup;
	}
}