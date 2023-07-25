import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { AuthService } from "../../auth/auth.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
  isLoginInvalid: boolean = false;
  isPasswordInvalid: boolean = false;

  loginForm = this.fb.group({
    email: ["", [Validators.email, Validators.required]],
    password: ["", [Validators.required]],
    rememberMe: [false],
  });

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
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

    const { email, password, rememberMe } = this.loginForm.value;

    try {
      const userData = await this.authService.loginUser(email, password);

      const idToken = await userData.user?.getIdToken();
      if (idToken && rememberMe) {
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
