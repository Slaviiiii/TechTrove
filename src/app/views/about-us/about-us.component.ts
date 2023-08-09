import { Component, OnDestroy, OnInit } from "@angular/core";
import { FirebaseService } from "../../firebaseService/firebase.service";
import { Subscription } from "rxjs";
import { Partner } from "src/app/interfaces/partner";

@Component({
  selector: "app-about-us",
  templateUrl: "./about-us.component.html",
  styleUrls: ["./about-us.component.css"],
})
export class AboutUsComponent implements OnInit, OnDestroy {
  partners: Partner[] = [];
  private partnersSubscription: Subscription = new Subscription();

  constructor(private firebaseService: FirebaseService) {}

  ngOnInit() {
    this.partnersSubscription = this.firebaseService.getPartners().subscribe({
      next: (partners: []) => {
        this.partners = this.firebaseService.setIds(
          Object.values(partners),
          Object.keys(partners)
        );
      },
      error: (err: any) => {
        console.error("Error:", err);
      },
    });
  }

  ngOnDestroy(): void {
    this.partnersSubscription.unsubscribe();
  }
}
