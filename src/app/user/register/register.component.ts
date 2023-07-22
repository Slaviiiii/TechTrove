import { Component, OnDestroy } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { matchPasswordValidator } from "../../shared/validators/match-passwords-validator";
import { appEmailValidator } from "src/app/shared/validators/app-email-validator";
import { AuthService } from "../services/auth.service";
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
  emailSubscription: Subscription | undefined;

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
  }

  ngOnDestroy(): void {
    if (this.emailSubscription) {
      this.emailSubscription.unsubscribe();
    }
  }

  async register() {
    if (this.registerForm.invalid) {
      return;
    }

    const { username, email, password, country } = this.registerForm?.value;

    try {
      const userData = await this.authService.registerUser(email, password);
      console.log(userData);

      const idToken = await userData.user?.getIdToken();
      if (idToken) {
        localStorage.setItem("token", idToken);
      }

      this.saveUserData(username, email, country);

      this.router.navigate(["/home"]);
    } catch (err: any) {
      if (err.message.includes("email")) {
        this.isEmailInvalid = true;
        this.registerForm.get("email")?.setValue("");
      }
    }
  }

  private saveUserData(username: any, email: any, country: any) {
    const userRef = this.afDb.database.ref("users");

    const userId = userRef.push().key;

    if (userId) {
      userRef.child(userId).set({
        username: username,
        email: email,
        country: country,
        cart: {},
        products: {},
      });
    } else {
      console.error("Error: Unable to get a valid user ID.");
    }
  }
}
