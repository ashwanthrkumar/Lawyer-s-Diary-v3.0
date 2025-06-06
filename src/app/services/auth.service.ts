import { Injectable } from '@angular/core';
import { doc, getDoc, Firestore } from '@angular/fire/firestore';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  User,
  onAuthStateChanged
} from '@angular/fire/auth';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public user$ = this.currentUserSubject.asObservable();

  private loggedInSubject: BehaviorSubject<boolean>;
  public isLoggedIn$: Observable<boolean>;

  constructor(private auth: Auth, private firestore: Firestore) {
    // Initialize loggedInSubject only if sessionStorage is available
    let initialLoggedIn = false;
    if (typeof window !== 'undefined' && window.sessionStorage) {
      initialLoggedIn = !!sessionStorage.getItem('loggedInUserUID');
    }

    this.loggedInSubject = new BehaviorSubject<boolean>(initialLoggedIn);
    this.isLoggedIn$ = this.loggedInSubject.asObservable();

    onAuthStateChanged(this.auth, (user) => {
      this.currentUserSubject.next(user);

      if (user && typeof window !== 'undefined' && window.sessionStorage) {
        sessionStorage.setItem('loggedInUserEmail', user.email ?? '');
        sessionStorage.setItem('loggedInUserUID', user.uid);
        this.loggedInSubject.next(true);
      } else if (typeof window !== 'undefined' && window.sessionStorage) {
        sessionStorage.removeItem('loggedInUserEmail');
        sessionStorage.removeItem('loggedInUserUID');
        this.loggedInSubject.next(false);
      }
    });
  }

  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  signup(email: string, password: string) {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  logout() {
    return signOut(this.auth).then(() => {
      if (typeof window !== 'undefined' && window.sessionStorage) {
        sessionStorage.clear();
      }
      this.loggedInSubject.next(false);
    });
  }

  setLoggedIn(uid: string) {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      sessionStorage.setItem('loggedInUserUID', uid);
    }
    this.loggedInSubject.next(true);
  }

  getLoggedInUserEmail(): string | null {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      return sessionStorage.getItem('loggedInUserEmail');
    }
    return null;
  }

  checkUserProfile(uid: string): Promise<boolean> {
    const userDocRef = doc(this.firestore, `users/${uid}`);
    return getDoc(userDocRef).then(docSnap => docSnap.exists());
  }

  getUserDetails(uid: string): Promise<any | null> {
    const userDocRef = doc(this.firestore, `users/${uid}`);
    return getDoc(userDocRef).then(docSnap => {
      return docSnap.exists() ? docSnap.data() : null;
    });
  }
}
