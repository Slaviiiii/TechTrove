import { Component } from "@angular/core";
import { AuthService } from "../auth.service";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.css"],
})
export class RegisterComponent {
  username: string = "";
  email: string = "";
  password: string = "";
  confirmPassword: string = "";
  country: string = "";

  constructor(private authService: AuthService) {}

  registerUser(): void {
    if (this.formValid()) {
      this.authService
        .registerUser(this.email, this.password)
        .then((userCredential: any) => {
          console.log("Registration successful", userCredential);
        })
        .catch((error: any) => {
          console.error("Registration failed", error);
        });
    }
  }

  formValid(): any {
    return (
      this.username &&
      this.email &&
      this.password &&
      this.confirmPassword &&
      this.password === this.confirmPassword
    );
  }
}
