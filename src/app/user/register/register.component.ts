import { Component, OnDestroy } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { matchPasswordValidator } from "../../shared/validators/match-passwords-validator";
import { appEmailValidator } from "src/app/shared/validators/app-email-validator";
import { AuthService } from "../services/auth.service";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";
import { debounceTime, distinctUntilChanged } from "rxjs/operators";

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
    private router: Router
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

    const { username, email, password, confirmPassword, country } =
      this.registerForm?.value;

    try {
      const userData = await this.authService.registerUser(email, password);
      console.log(userData);

      this.router.navigate(["/home"]);
    } catch (err: any) {
      if (err.message.includes("email")) {
        this.isEmailInvalid = true;
        this.registerForm.get("email")?.setValue("");
      }
    }
  }
}
