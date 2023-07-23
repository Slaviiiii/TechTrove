import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "src/app/auth/auth.service";

@Component({
  selector: "app-navigation",
  templateUrl: "./navigation.component.html",
  styleUrls: ["./navigation.component.css"],
})
export class NavigationComponent {
  isBurgerMenuOn: boolean = false;
  isDropDownOn: boolean = false;

  constructor(public authService: AuthService, private router: Router) {}

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

  async onLogout(event: Event) {
    event.preventDefault();
    await this.authService.logoutUser();
    this.onPageChange(event);
    this.router.navigate(["/home"]);
  }
}
