import { Component } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { AuthService } from "../services/auth.service";
import { Router } from "@angular/router";
import { appEmailValidator } from "src/app/shared/validators/app-email-validator";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent {
  isLoginInvalid: boolean = false;
  isPasswordInvalid: boolean = false;

  loginForm = this.fb.group({
    email: ["", [Validators.email, Validators.required, appEmailValidator()]],
    password: ["", [Validators.required]],
  });

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm.get("email")?.valueChanges.subscribe(() => {
      this.isLoginInvalid = false;
      this.isPasswordInvalid = false;
    });
    this.loginForm.get("password")?.valueChanges.subscribe(() => {
      this.isLoginInvalid = false;
      this.isPasswordInvalid = false;
    });
  }

  async login() {
    if (this.loginForm.invalid) {
      return;
    }

    const { email, password } = this.loginForm.value;

    try {
      const userData = await this.authService.loginUser(email, password);

      const idToken = await userData.user?.getIdToken();
      if (idToken) {
        localStorage.setItem("token", idToken);
      }

      this.router.navigate(["/home"]);
    } catch (err: any) {
      if (err.message.includes("user-not-found")) {
        this.isLoginInvalid = true;
      } else if (err.message.includes("wrong-password")) {
        this.isPasswordInvalid = true;
      }
    }
  }
}
