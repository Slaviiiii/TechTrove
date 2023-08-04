import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SpinnerComponent } from "./spinner/spinner.component";
import { CompletedPopupComponent } from "./completed-popup/completed-popup.component";
import { AppEmailDirective } from "./validators/app-email.directive";
import { MiniSpinnerComponent } from "./mini-spinner/mini-spinner.component";

@NgModule({
  declarations: [
    SpinnerComponent,
    CompletedPopupComponent,
    AppEmailDirective,
    MiniSpinnerComponent,
  ],
  imports: [CommonModule],
  exports: [
    SpinnerComponent,
    MiniSpinnerComponent,
    CompletedPopupComponent,
    AppEmailDirective,
  ],
})
export class SharedModule {}
