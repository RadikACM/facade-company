export interface Review {
  id?: string;
  projectId?: string;
  authorName: string;
  authorRole?: string;     
  rating: number;
  text: string;
  objectType?: string;
  createdAt?: Date | any;
}