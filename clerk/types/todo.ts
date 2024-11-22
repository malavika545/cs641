export interface Todo {
    id: string;
    text: string;
    completed: boolean;
    imageUrl?: string;
    createdAt: Date;
    userId: string;
  }