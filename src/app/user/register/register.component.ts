import { Component, OnDestroy } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { matchPasswordValidator } from "../../shared/validators/match-passwords-validator";
import { appEmailValidator } from "src/app/shared/validators/app-email-validator";
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
    country: ["", Validators.required],
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
    if (this.registerForm.invalid) {
      return;
    }

    const { username, email, password, country } = this.registerForm?.value;

    try {
      const usernameTaken = await this.checkUsernameExists(username);
      if (usernameTaken) {
        this.isUsernameTaken = true;
        return;
      }

      const userData = await this.authService.registerUser(
        email,
        password,
        username,
        country
      );

      const idToken = await userData.user?.getIdToken();

      if (idToken) {
        localStorage.setItem("token", idToken);
      }

      this.authService.saveUserData(
        userData.user?.uid,
        username,
        email,
        country
      );

      this.router.navigate(["/home"]);
    } catch (err: any) {
      if (err.message.includes("email")) {
        this.isEmailInvalid = true;
      } else if (err.message.includes("username")) {
        this.isUsernameTaken = true;
      }
    }
  }

  private async checkUsernameExists(username: any): Promise<boolean> {
    const usersSnapshot = await this.afDb.database
      .ref("users")
      .orderByChild("username")
      .equalTo(username)
      .once("value");
    return usersSnapshot.exists();
  }
}
