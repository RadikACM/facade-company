import { Review } from "./review.model";

export interface Project {
  id: string;

  title: string;
  description: string;
  fullDescription?: string;
  
  client: string;
  year: number;
  createdAt?: string;
  category: string

  imageUrl: string;
  gallery?: string[];

  clientReview?: Review;
}