import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { AuthService } from "src/app/auth/auth.service";
import { User } from "../../interfaces/user";

@Component({
  selector: "app-bank-account",
  templateUrl: "./bank-account.component.html",
  styleUrls: ["./bank-account.component.css"],
})
export class BankAccountComponent implements OnInit {
  user!: User;
  amountToAdd: number = 0;
  maxLimit: number = 15000;
  currentUser$!: Observable<User>;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.currentUser$ = this.authService.getCurrentUser();
    this.currentUser$.subscribe((user) => {
      this.user = user;
    });
  }

  onAmountChange(event: any): void {
    this.amountToAdd = parseInt(event.target.value, 10);
  }

  addAmount(): void {
    if (this.amountToAdd > this.remainingLimit) {
      alert(`Amount cannot exceed ${this.remainingLimit}`);
      return;
    }

    const updatedUser: User = {
      ...this.user,
      balance: this.user.balance + this.amountToAdd,
    };

    this.authService.updateProfile(updatedUser).subscribe(
      (response) => {
        this.user = response;
      },
      (error) => {
        console.error("Error updating user profile:", error);
      }
    );

    this.amountToAdd = 0;
  }

  get remainingLimit(): number {
    return this.maxLimit - this.user.balance;
  }
}
