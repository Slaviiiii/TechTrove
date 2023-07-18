import { Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { UserCredential, User } from "@firebase/auth-types";
import { Observable, map } from "rxjs";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  user$: Observable<firebase.User | null>;

  constructor(private afAuth: AngularFireAuth) {
    this.user$ = this.afAuth.authState;
  }

  registerUser(email: string, password: string): Promise<UserCredential> {
    return this.afAuth.createUserWithEmailAndPassword(email, password);
  }

  loginUser(email: string, password: string): Promise<UserCredential> {
    return this.afAuth.signInWithEmailAndPassword(email, password);
  }

  loginWithGoogle(): Promise<UserCredential> {
    const provider = new firebase.auth.GoogleAuthProvider();
    return this.afAuth.signInWithPopup(provider);
  }

  logout(): Promise<void> {
    return this.afAuth.signOut();
  }

  getCurrentUser(): Promise<User | null> {
    return new Promise((resolve, reject) => {
      this.afAuth.onAuthStateChanged(
        (user) => {
          resolve(user);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  isLoggedIn(): Observable<boolean> {
    return this.user$.pipe(
      map((user) => {
        return user !== null;
      })
    );
  }
}
