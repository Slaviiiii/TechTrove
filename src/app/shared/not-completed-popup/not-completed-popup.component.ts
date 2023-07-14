import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-not-completed-popup',
  templateUrl: './not-completed-popup.component.html',
  styleUrls: ['./not-completed-popup.component.css']
})
export class NotCompletedPopupComponent {
  @Input() searchError: string | undefined;

  showPopup: boolean = true;

	closePopup() {
    	this.showPopup = !this.showPopup;
	}
}