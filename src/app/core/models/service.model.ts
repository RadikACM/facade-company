export interface Service {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  imageUrl: string;
  order: number;
  isPublished: boolean;
  deliveryWeeks: number;
}