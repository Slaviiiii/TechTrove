import { Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { AngularFireDatabase } from "@angular/fire/compat/database";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { CartItem } from "../interfaces/cartItem";
import { User } from "../interfaces/user";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private tokenKey = "token";
  private loggedIn = false;

  constructor(
    private afAuth: AngularFireAuth,
    private afDb: AngularFireDatabase,
    private http: HttpClient
  ) {
    this.afAuth.authState.subscribe((user) => {
      this.setLoggedInStatus(!!user);
    });
    this.loggedIn = !!this.getToken();
  }

  isAuthenticated() {
    const token = localStorage.getItem("token");
    return token ? true : false;
  }

  async registerUser(
    username: any,
    password: any,
    email: any,
    country: any,
    name: any,
    surname: any,
    address: any
  ): Promise<firebase.auth.UserCredential> {
    const userData = await this.afAuth.createUserWithEmailAndPassword(
      email,
      password
    );

    if (userData && userData.user) {
      const uid = userData.user.uid;
      this.setUserId(uid);
      this.saveUserData(uid, username, email, country, name, surname, address);
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
      const uid = userData.user.uid;
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

  updateProfile(userData: User) {
    return this.http.put<User>(
      `${environment.firebaseConfig.databaseURL}/users/${userData._id}.json`,
      userData
    );
  }

  getCurrentUser(): Observable<User[]> {
    const userId = localStorage.getItem("userId");
    console.log(userId);
    return this.http.get<User[]>(
      `${environment.firebaseConfig.databaseURL}/users/${userId}.json`
    );
  }

  getCurrentUserCart(): Observable<CartItem[]> {
    const userId = localStorage.getItem("userId");
    return this.http.get<CartItem[]>(
      `${environment.firebaseConfig.databaseURL}/users/${userId}/cart.json`
    );
  }

  public saveUserData(
    uid: any,
    username: any,
    email: any,
    country: any,
    name: any,
    surname: any,
    address: any
  ): void {
    const userData = {
      username,
      email,
      country,
      name,
      surname,
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
