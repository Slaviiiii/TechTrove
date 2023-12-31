import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { LoginComponent } from "./login/login.component";
import { RegisterComponent } from "./register/register.component";
import { ProfileComponent } from "./profile/profile.component";
import { UserRoutingModule } from "./user-routing.module";
import { CartComponent } from "./cart/cart.component";
import { FormsModule } from "@angular/forms";
import { SharedModule } from "../shared/shared.module";
import { ReactiveFormsModule } from "@angular/forms";
import { ConfirmComponent } from "./confirm/confirm.component";
import { SuccessComponent } from "./success/success.component";
import { WishlistComponent } from "./wish-list/wish-list.component";
import { BankAccountComponent } from "./bank-account/bank-account.component";

@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    ProfileComponent,
    CartComponent,
    ConfirmComponent,
    ConfirmComponent,
    SuccessComponent,
    WishlistComponent,
    BankAccountComponent,
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class UserModule {}
