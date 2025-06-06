import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, addDoc,  doc, setDoc,getDoc,query, where, getDocs } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
//import { Injectable } from '@angular/core';
//import { Firestore, collection, collectionData, doc,  } from '@angular/fire/firestore';
import { from, forkJoin, map, switchMap } from 'rxjs';
import { Case } from '../../Model/case.model';
@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  constructor(private firestore: Firestore) {}
  setUser(uid: string, data: any) {
    const userDoc = doc(this.firestore, `users/${uid}`);
    return setDoc(userDoc, data);
  }
  getFirestore() {
    return this.firestore;
  }
  getUsers(): Observable<any[]> {
    const usersRef = collection(this.firestore, 'users');
    return collectionData(usersRef, { idField: 'id' });
  }
  getCasesWithClientNames(lawyerId: string): Observable<any[]> {
    const casesRef = collection(this.firestore, 'cases');
    const casesQuery = query(casesRef, where('lawyerId', '==', lawyerId));

    const fetchCasesWithClients = async () => {
      const snapshot = await getDocs(casesQuery);

      const cases: Case[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as Omit<Case, 'id'>)
      }));

      const enrichedCases = await Promise.all(cases.map(async caseItem => {
        const clientRef = doc(this.firestore, 'clients', caseItem.clientId);
        const clientSnap = await getDoc(clientRef);
        const clientData = clientSnap.exists() ? clientSnap.data() : { name: 'Unknown' };

        return {
          ...caseItem,
          clientName: clientData['name']
        };
      }));

      return enrichedCases;
    };

    return from(fetchCasesWithClients());
  }
}
