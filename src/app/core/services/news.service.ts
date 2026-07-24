import { inject, Injectable, signal } from '@angular/core';
import { Post } from '../models/news.model';
import { addDoc, collection, collectionData, deleteDoc, doc, Firestore, updateDoc } from '@angular/fire/firestore';
import { map, Observable, shareReplay } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NewsService {
  private firestore = inject(Firestore);
  public isUploading = signal(false);
  private postsRef = collection(this.firestore, 'news');
  private postsData$: Observable<Post[]> = (
    collectionData(this.postsRef, { idField: 'id' }) as Observable<any[]>
  ).pipe(
    map((posts) =>
      posts.map((post) => ({
        ...post,
        publishedAt: this.convertTimestamp(post.publishedAt),
      })),
    ),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  getsPosts(): Observable<Post[]> {
    return this.postsData$;
  }

  async addPost(post: Omit<Post, 'id' | 'createdAt'>) {
    return await addDoc(this.postsRef, {
      ...post,
      createdAt: new Date(),
    });
  }

  updatePost(postId: string, updatedPost: any) {
    const docRef = doc(this.firestore, `news/${postId}`);
    return updateDoc(docRef, updatedPost);
  }

  deletePost(postId: string) {
    const docRef = doc(this.firestore, `news/${postId}`);
    return deleteDoc(docRef);
  }

  private convertTimestamp(value: any): Date {
  if (!value) return new Date();
  if (typeof value.toDate === 'function') return value.toDate(); // Если это Firestore Timestamp
  return new Date(value);
}
}
