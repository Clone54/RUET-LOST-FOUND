export type ItemType = 'lost' | 'found';
export type ItemStatus = 'active' | 'resolved';

export interface Item {
  id: string;
  type: ItemType;
  title: string;
  shortDescription: string;
  fullDescription: string;
  category: string;
  date: string; // ISO string
  location: {
    lat: number;
    lng: number;
    name: string;
  };
  imageUrl?: string;
  contactPhone: string;
  status: ItemStatus;
  authorId: string;
  authorName: string;
  createdAt: string;
}

export interface Comment {
  id: string;
  itemId: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: string;
  parentId?: string; // For replies
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  createdAt: string;
}
