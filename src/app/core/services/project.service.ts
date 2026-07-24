import { inject, Injectable } from '@angular/core';
import { Firestore, collection, collectionData, addDoc, doc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { Observable, map, shareReplay } from 'rxjs';
import { Project } from '../models/project.model';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private firestore = inject(Firestore);
  private projectsRef = collection(this.firestore, 'projects');

  private projectsData$: Observable<Project[]> = (
    collectionData(this.projectsRef, { idField: 'id' }) as Observable<any[]>
  ).pipe(
    map((projects) =>
      projects.map((project) => ({
        ...project,
        createdAt: this.convertTimestamp(project.createdAt),
      })),
    ),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  getProjects(): Observable<Project[]> {
    return this.projectsData$;
  }

  async addProject(project: Omit<Project, 'id'>) {
    return await addDoc(this.projectsRef, {
      ...project,
      createdAt: new Date(),
    });
  }

  updateProject(projectId: string, updatedProject: any) {
    const docRef = doc(this.firestore, `projects/${projectId}`);
    return updateDoc(docRef, updatedProject);
  }

  deleteProject(projectId: string) {
    const docRef = doc(this.firestore, `projects/${projectId}`);
    return deleteDoc(docRef);
  }

  private convertTimestamp(value: any): Date {
  if (!value) return new Date();
  if (typeof value.toDate === 'function') return value.toDate(); // Если это Firestore Timestamp
  return new Date(value);
}
}
