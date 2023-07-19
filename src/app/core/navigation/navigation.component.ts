import { Component } from "@angular/core";
import { Observable } from "rxjs";
import { AuthService } from "src/app/user/services/auth.service";

@Component({
  selector: "app-navigation",
  templateUrl: "./navigation.component.html",
  styleUrls: ["./navigation.component.css"],
})
export class NavigationComponent {
  isBurgerMenuOn: boolean = false;
  isDropDownOn: boolean = false;
  isLoggedIn: Observable<boolean>;

  constructor(private authService: AuthService) {
    this.isLoggedIn = this.authService.isLoggedIn();
  }

  onBurgerClick() {
    if (this.isDropDownOn) {
      this.isDropDownOn = !this.isDropDownOn;
    }
    this.isBurgerMenuOn = !this.isBurgerMenuOn;
  }

  onDropDownClick() {
    if (this.isBurgerMenuOn) {
      this.isBurgerMenuOn = !this.isBurgerMenuOn;
    }
    this.isDropDownOn = !this.isDropDownOn;
  }

  onPageChange(event: Event) {
    event.preventDefault();
    if (this.isDropDownOn) {
      this.isDropDownOn = !this.isDropDownOn;
    } else if (this.isBurgerMenuOn) {
      this.isBurgerMenuOn = !this.isBurgerMenuOn;
    }
  }
}
