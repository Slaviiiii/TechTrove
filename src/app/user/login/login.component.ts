import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { AuthService } from "../../auth/auth.service";
import { Router, ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
  isLoginInvalid: boolean = false;
  isPasswordInvalid: boolean = false;
  redirectedFrom: string | null = null;

  loginForm = this.fb.group({
    email: ["", [Validators.email, Validators.required]],
    password: ["", [Validators.required, Validators.minLength(6)]],
  });

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.queryParamMap.subscribe((params) => {
      this.redirectedFrom = params.get("redirectedFrom");
    });

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

      if (this.redirectedFrom) {
        this.router.navigateByUrl(this.redirectedFrom);
      } else {
        this.router.navigate(["/home"]);
      }
    } catch (err: any) {
      if (err.message.includes("user-not-found")) {
        this.isLoginInvalid = true;
        this.isPasswordInvalid = false;
      } else if (err.message.includes("wrong-password")) {
        this.isPasswordInvalid = true;
        this.isLoginInvalid = false;
      }
    }
  }
}
