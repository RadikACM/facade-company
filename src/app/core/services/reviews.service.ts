import { inject, Injectable } from '@angular/core';
import { Firestore, collection, collectionData, doc, addDoc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { Observable, map, shareReplay, from } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { Review } from '../models/review.model';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  private readonly firestore = inject(Firestore);
  private readonly reviewsCollection = collection(this.firestore, 'reviews');

  private readonly reviews$: Observable<Review[]> = (
    collectionData(this.reviewsCollection, { idField: 'id' }) as Observable<any[]>
  ).pipe(
    map((reviews) =>
      reviews
        .map((r) => ({
          ...r,
          createdAt: r.createdAt?.toDate ? r.createdAt.toDate() : new Date(r.createdAt),
        }))
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    ),
    shareReplay({ bufferSize: 1, refCount: false })
  );

  getReviews(): Observable<Review[]> {
      return this.reviews$;
    }

  readonly reviews = toSignal(this.reviews$, { initialValue: [] });

  /** Создание отзыва */
  addReview(newReview: Omit<Review, 'id'>): Observable<any> {
    return from(
      addDoc(this.reviewsCollection, {
        ...newReview,
        createdAt: newReview.createdAt || new Date(),
      })
    );
  }

  updateReview(id: string, updatedData: Partial<Review>): Observable<void> {
    const docRef = doc(this.firestore, `reviews/${id}`);
    return from(updateDoc(docRef, updatedData));
  }

  deleteReview(id: string): Observable<void> {
    const docRef = doc(this.firestore, `reviews/${id}`);
    return from(deleteDoc(docRef));
  }
}