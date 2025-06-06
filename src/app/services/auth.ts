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

  constructor(private auth: Auth, private firestore: Firestore) {
    // Listen for login/logout
    onAuthStateChanged(this.auth, (user) => {
      this.currentUserSubject.next(user);

      if (user) {
        // Save email/UID in session storage
        sessionStorage.setItem('loggedInUserEmail', user.email ?? '');
        sessionStorage.setItem('loggedInUserUID', user.uid);
      } else {
        sessionStorage.removeItem('loggedInUserEmail');
        sessionStorage.removeItem('loggedInUserUID');
      }
    });
  }

  // Access current user synchronously
  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  // Sign up method
  signup(email: string, password: string) {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  // Login method
  login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  // Logout method
  logout() {
    sessionStorage.clear();
    return signOut(this.auth);
  }

  // Optional helper: Get email from storage
  getLoggedInUserEmail(): string | null {
    return sessionStorage.getItem('loggedInUserEmail');
  }
  checkUserProfile(uid: string): Promise<boolean> {
    const userDocRef = doc(this.firestore, `users/${uid}`);
    return getDoc(userDocRef).then(docSnap => docSnap.exists());
  }
}
