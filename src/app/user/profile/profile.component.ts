import { Component, OnDestroy } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { AuthService } from "../../auth/auth.service";
import { Subscription } from "rxjs";
import { debounceTime, distinctUntilChanged } from "rxjs/operators";
import { countries } from "src/app/shared/validators/countries";
import { addressValidator } from "src/app/shared/validators/address.validator";
import { textValidator } from "src/app/shared/validators/text.validator";
import { Router } from "@angular/router";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.css"],
})
export class ProfileComponent implements OnDestroy {
  isEditMode: boolean = false;
  countriesList: string[] = countries;
  currentUser: any;

  profileForm = this.fb.group({
    username: ["", [Validators.minLength(4), Validators.required]],
    email: ["", [Validators.email, Validators.required]],
    country: ["", [Validators.required]],
    name: [
      "",
      [
        Validators.required,
        textValidator(),
        Validators.minLength(3),
        Validators.maxLength(20),
      ],
    ],
    surname: [
      "",
      [
        Validators.required,
        textValidator(),
        Validators.minLength(5),
        Validators.maxLength(20),
      ],
    ],
    address: ["", [Validators.required, addressValidator()]],
    cart: {},
  });

  private emailSubscription: Subscription | undefined;
  private usernameSubscription: Subscription | undefined;
  isUsernameTaken: boolean = false;
  isEmailInvalid: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.emailSubscription = this.profileForm
      .get("email")
      ?.valueChanges.pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(() => {
        this.isEmailInvalid = false;
      });

    this.usernameSubscription = this.profileForm
      .get("username")
      ?.valueChanges.pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(() => {
        this.isUsernameTaken = false;
      });

    this.authService.getCurrentUser().subscribe((user: any) => {
      this.currentUser = { ...user };
      this.profileForm.patchValue({
        username: this.currentUser.username,
        email: this.currentUser.email,
        country: this.currentUser.country,
        name: this.currentUser.name,
        surname: this.currentUser.surname,
        address: this.currentUser.address,
        cart: this.currentUser.cart,
      });
    });
  }

  ngOnDestroy(): void {
    if (this.emailSubscription) {
      this.emailSubscription.unsubscribe();
    }
    if (this.usernameSubscription) {
      this.usernameSubscription.unsubscribe();
    }
  }

  toggleEditMode(): void {
    this.isEditMode = !this.isEditMode;
  }

  async updateProfile() {
    if (this.profileForm.invalid) {
      return;
    }

    const { username, email, country, surname, name, address } =
      this.profileForm.value;

    try {
      const usernameTaken = await this.authService.checkUsernameExists(
        username
      );
      if (usernameTaken) {
        this.isUsernameTaken = true;
        return;
      }

      this.authService
        .updateProfile({
          username,
          email,
          country,
          surname,
          name,
          address,
        })
        .subscribe(
          (response: any) => {
            console.log("Profile updated successfully:", response);
            this.isEditMode = false;
          },
          (error: any) => {
            console.error("Failed to update profile:", error);
          }
        );

      this.router.navigate(["/home"]);
    } catch (err) {
      console.log("Error:", err);
    }
  }
}
