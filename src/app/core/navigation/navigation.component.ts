import { Component } from "@angular/core";
import { Observable } from "rxjs";
import { AuthService } from "src/app/user/auth.service";

@Component({
  selector: "app-navigation",
  templateUrl: "./navigation.component.html",
  styleUrls: ["./navigation.component.css"],
})
export class NavigationComponent {
  isBurgerMenuOn: boolean = false;
  isDropDownOn: boolean = false;
  isLoggedIn: Observable<boolean>;

  onBurgerClick() {
    if (this.isDropDownOn) {
      this.isDropDownOn = false;
    }
    this.isBurgerMenuOn = !this.isBurgerMenuOn;
  }

  onDropDownClick() {
    if (this.isBurgerMenuOn) {
      this.isBurgerMenuOn = false;
    }
    this.isDropDownOn = !this.isDropDownOn;
  }

  constructor(private authService: AuthService) {
    this.isLoggedIn = this.authService.isLoggedIn();
  }
}
