import { Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { AngularFireDatabase } from "@angular/fire/compat/database";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import { appEmailValidator } from "src/app/shared/validators/app-email-validator";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private tokenKey = "token";
  private loggedIn = false;

  constructor(
    private afAuth: AngularFireAuth,
    private afDb: AngularFireDatabase
  ) {
    this.afAuth.authState.subscribe((user) => {
      this.setLoggedInStatus(!!user);
    });
    this.loggedIn = !!this.getToken();
  }

  async registerUser(
    username: any,
    password: any,
    email: any,
    country: any,
    name: any,
    surname: any,
    telephone: any,
    region: any,
    populatedPlace: any,
    address: any
  ): Promise<firebase.auth.UserCredential> {
    const userData = await this.afAuth.createUserWithEmailAndPassword(
      email,
      password
    );

    if (userData && userData.user) {
      const { uid } = userData.user;
      this.setUserId(uid);
      this.saveUserData(
        uid,
        username,
        email,
        country,
        name,
        surname,
        telephone,
        region,
        populatedPlace,
        address
      );
    }

    return userData;
  }

  async loginUser(
    email: any,
    password: any
  ): Promise<firebase.auth.UserCredential> {
    const userData = await this.afAuth.signInWithEmailAndPassword(
      email,
      password
    );

    if (userData && userData.user) {
      const { uid } = userData.user;
      this.setUserId(uid);
      const token = await userData.user.getIdToken();
      this.setToken(token);
    }

    return userData;
  }

  logoutUser(): Promise<void> {
    this.clearToken();
    this.clearUserId();
    return this.afAuth.signOut();
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
    this.setLoggedInStatus(true);
  }

  clearToken(): void {
    localStorage.removeItem(this.tokenKey);
    this.setLoggedInStatus(false);
  }

  setUserId(uid: string) {
    localStorage.setItem("userId", uid);
  }

  clearUserId() {
    localStorage.removeItem("userId");
  }

  isLogged(): boolean {
    return this.loggedIn;
  }

  private setLoggedInStatus(status: boolean): void {
    this.loggedIn = status;
  }

  getCurrentUserId(): any {
    const uid = localStorage.getItem("userId");
    return uid;
  }

  async setProductForCurrentUser(productId: string): Promise<void> {
    const currentUserId = await this.getCurrentUserId();
    if (currentUserId) {
      return this.afDb.database
        .ref(`users/${currentUserId}/products/${productId}`)
        .set(true);
    }
  }

  public saveUserData(
    uid: any,
    username: any,
    email: any,
    country: any,
    name: any,
    surname: any,
    telephone: any,
    region: any,
    populatedPlace: any,
    address: any
  ): void {
    const userData = {
      username,
      email,
      country,
      name,
      surname,
      telephone,
      region,
      populatedPlace,
      address,
      balance: 0,
    };

    this.afDb.database
      .ref("users/" + uid)
      .update(userData)
      .then(() => {
        console.log("User data saved successfully!");
      })
      .catch((error) => {
        console.error("Error saving user data:", error);
      });
  }
}
