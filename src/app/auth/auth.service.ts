import { Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { AngularFireDatabase } from "@angular/fire/compat/database";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { CartItem } from "../interfaces/cartItem";
import { User } from "../interfaces/user";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import {
  Observable,
  BehaviorSubject,
  debounceTime,
  distinctUntilChanged,
  Subject,
} from "rxjs";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private tokenKey = "token";
  private loggedIn = false;
  private loggedInStatus = new BehaviorSubject<boolean>(false);
  userStatusChanged = this.loggedInStatus.asObservable();

  cartChangedSubject: Subject<void> = new Subject<void>();

  constructor(
    private afAuth: AngularFireAuth,
    private afDb: AngularFireDatabase,
    private http: HttpClient
  ) {
    this.afAuth.authState.subscribe((user) => {
      this.setLoggedInStatus(!!user);
    });
    this.loggedIn = !!this.getToken();
    this.setLoggedInStatus(this.loggedIn);
  }

  isAuthenticated() {
    const token = this.getToken();
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

  getUserId() {
    return localStorage.getItem("userId");
  }

  isLogged(): boolean {
    return this.loggedIn;
  }

  private setLoggedInStatus(status: boolean): void {
    this.loggedIn = status;
    this.loggedInStatus.next(status);
  }

  updateProfile(userData: Object) {
    const userId = this.getUserId();
    return this.http.put<User>(
      `${environment.firebaseConfig.databaseURL}/users/${userId}.json`,
      userData
    );
  }

  getCurrentUser(): Observable<User[]> {
    const userId = this.getUserId();
    return this.http.get<User[]>(
      `${environment.firebaseConfig.databaseURL}/users/${userId}.json`
    );
  }

  getCurrentUserCart(): Observable<CartItem[]> {
    const userId = this.getUserId();
    return this.http.get<CartItem[]>(
      `${environment.firebaseConfig.databaseURL}/users/${userId}/cart.json`
    );
  }

  async checkUsernameExists(username: any) {
    return new Promise<boolean>((resolve) => {
      this.afDb
        .list("usernames", (ref) =>
          ref.orderByValue().equalTo(username.toLowerCase()).limitToFirst(1)
        )
        .valueChanges()
        .pipe(debounceTime(500), distinctUntilChanged())
        .subscribe((data) => {
          resolve(data && data.length > 0);
        });
    });
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

  addToCart(product: CartItem): Observable<void> {
    const userId = this.getUserId();
    return this.http.post<void>(
      `${environment.firebaseConfig.databaseURL}/users/${userId}/cart.json`,
      product
    );
  }

  removeFromCart(productKey: string): Observable<void> {
    const userId = this.getUserId();
    return this.http.delete<void>(
      `${environment.firebaseConfig.databaseURL}/users/${userId}/cart/${productKey}.json`
    );
  }

  clearCart(): Observable<void> {
    const userId = this.getUserId();
    return this.http.delete<void>(
      `${environment.firebaseConfig.databaseURL}/users/${userId}/cart.json`
    );
  }
}
