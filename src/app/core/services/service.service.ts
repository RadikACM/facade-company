import { inject, Injectable, signal } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
} from '@angular/fire/firestore';
import { Service } from '../models/service.model';
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ServiceService {
  private readonly firestore = inject(Firestore);
  private readonly servicesCollection = collection(this.firestore, 'services');

  private readonly _services = signal<Service[]>([]);
  readonly services = this._services.asReadonly(); // для чтения данных из компонента

  private readonly isLoading = signal<boolean>(false);

  constructor() {
    this.loadAllServices();
  }

  private loadAllServices(): void {
    this.isLoading.set(true);
    
    // Получаем Observable из коллекции
    const services$ = collectionData(this.servicesCollection, { idField: 'id' }) as Observable<Service[]>;
    
    // Подписываемся и перекладываем данные в сигнал
    services$.subscribe({
      next: (data) => {
        // Сортируем, например, по сроку доставки или по алфавиту
        this._services.set(data.sort((a, b) => a.deliveryWeeks - b.deliveryWeeks));
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Ошибка при загрузке услуг из Firestore:', err);
        this.isLoading.set(false);
      }
    });
  }

  createService(newService: Omit<Service, 'id'>): Observable<any> {
    return from(addDoc(this.servicesCollection, newService));
  }

  updateService(id: string, updatedData: Partial<Service>): Observable<void> {
    const serviceDocRef = doc(this.firestore, `services/${id}`);
    return from(updateDoc(serviceDocRef, updatedData));
  }

  deleteService(id: string): Observable<void> {
    const serviceDocRef = doc(this.firestore, `services/${id}`);
    return from(deleteDoc(serviceDocRef));
  }
}
