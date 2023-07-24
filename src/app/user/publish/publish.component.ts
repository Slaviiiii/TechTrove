import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "src/app/auth/auth.service";
import { FirebaseService } from "src/app/firebaseService/firebase.service";

@Component({
  selector: "app-publish",
  templateUrl: "./publish.component.html",
  styleUrls: ["./publish.component.css"],
})
export class PublishComponent implements OnInit {
  productForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private firebaseService: FirebaseService,
    private router: Router
  ) {
    this.productForm = this.formBuilder.group({
      name: ["", [Validators.required, Validators.minLength(4)]],
      description: ["", [Validators.required, Validators.minLength(5)]],
      from: ["", [Validators.required, Validators.minLength(4)]],
      price: [null, [Validators.required, Validators.min(50)]],
      promotion: new FormControl(0, [
        Validators.required,
        Validators.pattern(/^\d+$/),
        Validators.min(0),
      ]),
      shipping: new FormControl(0, [
        Validators.required,
        Validators.pattern(/^\d+$/),
        Validators.min(0),
      ]),
      type: ["", Validators.required],
      img: ["", Validators.required],
      agreement: [false, Validators.requiredTrue],
    });
  }

  ngOnInit(): void {}

  onFileChange(event: any): void {
    if (event.target.files && event.target.files.length) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.productForm.patchValue({
          img: reader.result,
        });
      };
    }
  }

  async publishProduct() {
    if (this.productForm.invalid) {
      return;
    }

    const { name, description, from, price, promotion, shipping, type, img } =
      this.productForm.value;
    console.log(this.productForm.value);

    try {
      const userId: any = await this.authService.getCurrentUserId().toPromise();

      if (!userId) {
        throw new Error("User ID not found.");
      }

      console.log(userId);
      const product: Object = {
        name,
        description,
        from,
        price,
        promotion,
        img,
        shipping,
        type,
        userId: userId,
        _id: undefined,
      };

      const productData = await this.firebaseService.publishProduct(product);
      const id = productData._id;

      const settedProduct = await this.authService.setProductForCurrentUser(id);

      this.router.navigate(["products"]);
    } catch (err: any) {
      console.error(err);
    }
  }
}
