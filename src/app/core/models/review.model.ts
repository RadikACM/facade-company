export interface Review {
  id?: string;
  authorName: string;
  authorRole?: string;     // Например: "Владелец коттеджа" или "Главный архитектор"
  rating: number;         // От 1 до 5
  text: string;
  objectType?: string;    // Например: "Частный дом", "АКП фасад"
  createdAt?: Date | any;
}