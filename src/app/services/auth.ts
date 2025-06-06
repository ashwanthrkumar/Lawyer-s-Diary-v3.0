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
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public user$ = this.currentUserSubject.asObservable();

  private loggedInSubject = new BehaviorSubject<boolean>(!!sessionStorage.getItem('loggedInUserUID'));
  public isLoggedIn$ = this.loggedInSubject.asObservable();

  constructor(private auth: Auth, private firestore: Firestore) {
    onAuthStateChanged(this.auth, (user) => {
      this.currentUserSubject.next(user);

      if (user) {
        sessionStorage.setItem('loggedInUserEmail', user.email ?? '');
        sessionStorage.setItem('loggedInUserUID', user.uid);
        this.loggedInSubject.next(true); // ✅ trigger update
      } else {
        sessionStorage.removeItem('loggedInUserEmail');
        sessionStorage.removeItem('loggedInUserUID');
        this.loggedInSubject.next(false); // ✅ trigger update
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
      sessionStorage.clear();
      this.loggedInSubject.next(false);
    });
  }

  setLoggedIn(uid: string) {
    sessionStorage.setItem('loggedInUserUID', uid);
    this.loggedInSubject.next(true);
  }

  getLoggedInUserEmail(): string | null {
    return sessionStorage.getItem('loggedInUserEmail');
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
