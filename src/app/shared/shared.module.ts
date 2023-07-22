import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SpinnerComponent } from "./spinner/spinner.component";
import { CompletedPopupComponent } from "./completed-popup/completed-popup.component";
import { AppEmailDirective } from "./validators/app-email.directive";

@NgModule({
  declarations: [SpinnerComponent, CompletedPopupComponent, AppEmailDirective],
  imports: [CommonModule],
  exports: [SpinnerComponent, CompletedPopupComponent, AppEmailDirective],
})
export class SharedModule {}
