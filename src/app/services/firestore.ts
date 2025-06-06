import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, addDoc,  doc, setDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  constructor(private firestore: Firestore) {}
  setUser(uid: string, data: any) {
    const userDoc = doc(this.firestore, `users/${uid}`);
    return setDoc(userDoc, data);
  }
  getUsers(): Observable<any[]> {
    const usersRef = collection(this.firestore, 'users');
    return collectionData(usersRef, { idField: 'id' });
  }
}
