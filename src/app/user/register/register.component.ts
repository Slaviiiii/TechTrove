import { Component, OnDestroy } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { appEmailValidator } from "src/app/shared/validators/app-email-validator";
import { matchPasswordValidator } from "../../shared/validators/match-passwords-validator";
import { addressValidator } from "../../shared/validators/address.validator";
import { AuthService } from "../../auth/auth.service";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";
import { debounceTime, distinctUntilChanged } from "rxjs/operators";
import { AngularFireDatabase } from "@angular/fire/compat/database";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.css"],
})
export class RegisterComponent implements OnDestroy {
  isEmailInvalid: boolean = false;
  isUsernameTaken: boolean = false;
  emailSubscription: Subscription | undefined;
  usernameSubscription: Subscription | undefined;

  registerForm = this.fb.group({
    username: ["", [Validators.minLength(4), Validators.required]],
    email: ["", [Validators.email, Validators.required, appEmailValidator()]],
    password: ["", [Validators.minLength(6), Validators.required]],
    confirmPassword: [
      "",
      [
        Validators.required,
        matchPasswordValidator("password", "confirmPassword"),
      ],
    ],
    country: [
      "",
      [Validators.required, Validators.minLength(3), Validators.maxLength(20)],
    ],
    name: [
      "",
      [Validators.required, Validators.minLength(4), Validators.maxLength(20)],
    ],
    surname: ["", Validators.required],
    address: ["", [Validators.required, addressValidator()]],
    agreement: [false, Validators.requiredTrue],
  });

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private afDb: AngularFireDatabase
  ) {
    this.emailSubscription = this.registerForm
      .get("email")
      ?.valueChanges.pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(() => {
        this.isEmailInvalid = false;
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

  async register() {
    console.log(this.registerForm.value);
    const { username, email, password, country, surname, name, address } =
      this.registerForm.value;

    try {
      const usernameTaken = await this.checkUsernameExists(username);
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
        localStorage.setItem("token", idToken);
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
    } catch (err) {
      console.log("Error:", err);
    }
  }

  async checkUsernameExists(username: any) {
    return new Promise<boolean>((resolve) => {
      this.afDb
        .list("usernames", (ref) =>
          ref.orderByValue().equalTo(username.toLowerCase()).limitToFirst(1)
        )
        .valueChanges()
        .pipe(debounceTime(500), distinctUntilChanged())
        .subscribe((data) => {
          resolve(data && data.length > 0);
        });
    });
  }
}
