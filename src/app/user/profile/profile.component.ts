import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { AuthService } from "src/app/auth/auth.service";
import { User } from "../../interfaces/user";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.css"],
})
export class ProfileComponent implements OnInit, OnDestroy {
  currentUser!: any;
  private currentUserSubscription: Subscription = new Subscription();

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.currentUserSubscription = this.authService
      .getCurrentUser()
      .subscribe((user: any) => {
        if (user.address.split(" ").length === 5) {
          const [streetW1, streetW2, streetW3, city, postalCode] =
            user.address.split(" ");
          this.currentUser = {
            ...user,
            street: `${streetW1} ${streetW2} ${streetW3}`,
            city: city,
            postalCode: postalCode,
          };
        } else if (user.address.split(" ").length === 4) {
          const [streetW1, streetW2, city, postalCode] =
            user.address.split(" ");

          this.currentUser = {
            ...user,
            street: `${streetW1} ${streetW2}`,
            city: city,
            postalCode: postalCode,
          };
        } else {
          const [streetW1, city, postalCode] = user.address.split(" ");
          this.currentUser = {
            ...user,
            street: `${streetW1}`,
            city: city,
            postalCode: postalCode,
          };
        }
      });
  }

  ngOnDestroy(): void {
    this.currentUserSubscription.unsubscribe();
  }

  updateProfile(): void {
    this.authService.updateProfile(this.currentUser).subscribe(
      (response: any) => {
        console.log("Profile updated successfully:", response);
      },
      (error: any) => {
        console.error("Failed to update profile:", error);
      }
    );
  }
}
