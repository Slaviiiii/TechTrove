import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SpinnerComponent } from "./spinner/spinner.component";
import { AppEmailDirective } from "./validators/app-email.directive";
import { MiniSpinnerComponent } from "./mini-spinner/mini-spinner.component";

@NgModule({
  declarations: [SpinnerComponent, AppEmailDirective, MiniSpinnerComponent],
  imports: [CommonModule],
  exports: [SpinnerComponent, MiniSpinnerComponent, AppEmailDirective],
})
export class SharedModule {}
