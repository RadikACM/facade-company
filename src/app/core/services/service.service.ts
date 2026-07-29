import { inject, Injectable } from '@angular/core';
import { Firestore, collection, collectionData, doc, addDoc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { Service } from '../models/service.model';
import { from, Observable, map, shareReplay } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class ServiceService {
  private readonly firestore = inject(Firestore);
  private readonly servicesCollection = collection(this.firestore, 'services');

  // Превращаем Observable сразу в Сигнал с автоматической сортировкой
  private readonly services$ = (
    collectionData(this.servicesCollection, { idField: 'id' }) as Observable<Service[]>
  ).pipe(
    map((services) => services.sort((a, b) => a.deliveryWeeks - b.deliveryWeeks)),
    shareReplay({ bufferSize: 1, refCount: false }) // refCount: false удерживает последнюю подписку активной
  );

  // Публичный сигнал для компонентов (по умолчанию пустой массив [])
  readonly services = toSignal(this.services$, { initialValue: [] });

  getServices(): Observable<Service[]> {
    return this.services$;
  }

  createService(newService: Omit<Service, 'id'>): Observable<any> {
    return from(addDoc(this.servicesCollection, {
      ...newService,
      createdAt: new Date(),
      updatedAt: new Date()
    }));
  }

  updateService(id: string, updatedData: Partial<Service>): Observable<void> {
    const serviceDocRef = doc(this.firestore, `services/${id}`);
    return from(updateDoc(serviceDocRef, {
      ...updatedData,
      updatedAt: new Date()
    }));
  }

  deleteService(id: string): Observable<void> {
    const serviceDocRef = doc(this.firestore, `services/${id}`);
    return from(deleteDoc(serviceDocRef));
  }
}