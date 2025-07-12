export interface Notification {
  id: string;
  userId: string;
  title: string;
  preview: string;
  content: string;
  read: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}
