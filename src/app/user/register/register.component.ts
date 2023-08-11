import { Component, OnDestroy } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { appEmailValidator } from "src/app/shared/validators/app-email-validator";
import { matchPasswordValidator } from "../../shared/validators/match-passwords-validator";
import { addressValidator } from "../../shared/validators/address.validator";
import { textValidator } from "../../shared/validators/text.validator";
import { AuthService } from "../../auth/auth.service";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";
import { debounceTime, distinctUntilChanged } from "rxjs/operators";
import { countries } from "src/app/shared/validators/countries";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.css"],
})
export class RegisterComponent implements OnDestroy {
  isUsernameTaken: boolean = false;
  isEmailTaken: boolean = false;
  emailSubscription: Subscription | undefined;
  usernameSubscription: Subscription | undefined;
  countriesList: string[] = countries;
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  registerForm = this.fb.group({
    username: [
      "",
      [Validators.required, Validators.minLength(4), Validators.maxLength(20)],
    ],
    email: ["", [Validators.email, Validators.required, appEmailValidator()]],
    password: ["", [Validators.minLength(6), Validators.required]],
    confirmPassword: [
      "",
      [
        Validators.required,
        matchPasswordValidator("password", "confirmPassword"),
      ],
    ],
    country: ["", [Validators.required]],
    name: [
      "",
      [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(20),
        textValidator(),
      ],
    ],
    surname: [
      "",
      [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(20),
        textValidator(),
      ],
    ],
    address: ["", [Validators.required, addressValidator()]],
    agreement: [false, Validators.requiredTrue],
  });

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.emailSubscription = this.registerForm
      .get("email")
      ?.valueChanges.pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(() => {
        this.isEmailTaken = false;
      });

    this.usernameSubscription = this.registerForm
      .get("username")
      ?.valueChanges.pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(() => {
        this.isUsernameTaken = false;
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

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  async register() {
    const { username, email, password, country, surname, name, address } =
      this.registerForm.value;

    try {
      const usernameTaken = await this.authService.checkUsernameExists(
        username
      );
      if (usernameTaken) {
        this.isUsernameTaken = true;
        return;
      }

      const userData = await this.authService.registerUser(
        username,
        password,
        email,
        country,
        name,
        surname,
        address
      );

      const idToken = await userData.user?.getIdToken();

      if (idToken) {
        this.authService.setToken(idToken);
      }

      this.authService.saveUserData(
        userData.user?.uid,
        username,
        email,
        this.registerForm.get("country")?.value,
        this.registerForm.get("name")?.value,
        this.registerForm.get("surname")?.value,
        this.registerForm.get("address")?.value
      );

      this.router.navigate(["/home"]);
    } catch (err: any) {
      if (err.message.includes("email-already")) {
        this.isEmailTaken = true;
      }
    }
  }
}
