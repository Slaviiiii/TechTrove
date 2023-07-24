import { Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { AngularFireDatabase } from "@angular/fire/compat/database";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import { Observable, map, switchMap } from "rxjs";

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
    email: any,
    password: any,
    username: any,
    country: any
  ): Promise<firebase.auth.UserCredential> {
    const userData = await this.afAuth.createUserWithEmailAndPassword(
      email,
      password
    );

    if (userData && userData.user) {
      const { uid } = userData.user;
      this.saveUserData(uid, username, email, country);
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
      const token = await userData.user.getIdToken();
      this.setToken(token);
    }

    return userData;
  }

  logoutUser(): Promise<void> {
    this.clearToken();
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

  isLogged(): boolean {
    return this.loggedIn;
  }

  private setLoggedInStatus(status: boolean): void {
    this.loggedIn = status;
  }

  getCurrentUserId(): Observable<string | null> {
    return this.afAuth.authState.pipe(
      map((user: any) => {
        return user ? user.uid : null;
      })
    );
  }

  async setProductForCurrentUser(productId: string): Promise<void> {
    const currentUserId = await this.getCurrentUserId().toPromise();
    if (currentUserId) {
      return this.afDb.database
        .ref(`users/${currentUserId}/products/${productId}`)
        .set(true);
    }
  }

  public saveUserData(uid: any, username: any, email: any, country: any): void {
    const userData = {
      username: username,
      email: email,
      country: country,
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
