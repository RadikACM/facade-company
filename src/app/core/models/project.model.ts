export interface Project {
  id: string;

  title: string;
  description: string;
  fullDescription?: string;
  
  client: string;
  year: number;
  createdAt?: string;

  imageUrl: string;
  gallery?: string[];
}