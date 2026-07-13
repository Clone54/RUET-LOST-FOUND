import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  serverTimestamp,
  deleteField,
  getCountFromServer,
  limit
} from 'firebase/firestore';
import { db } from './firebase';
import { Item, Comment, ItemType, ItemStatus } from '../types';

const ITEMS_COLLECTION = 'items';
const COMMENTS_COLLECTION = 'comments';

export const api = {
  async getItems(filters?: { type?: ItemType, category?: string }) {
    let q = query(collection(db, ITEMS_COLLECTION), orderBy('createdAt', 'desc'));
    
    if (filters?.type) {
      q = query(q, where('type', '==', filters.type));
    }
    if (filters?.category) {
      q = query(q, where('category', '==', filters.category));
    }
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Item));
  },

  async getItem(id: string) {
    const docRef = doc(db, ITEMS_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Item;
    }
    throw new Error('Item not found');
  },

  async getUserItems(userId: string) {
    const q = query(
      collection(db, ITEMS_COLLECTION),
      where('authorId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Item));
  },

  async createItem(itemData: Omit<Item, 'id' | 'createdAt'>) {
    const docRef = await addDoc(collection(db, ITEMS_COLLECTION), {
      ...itemData,
      createdAt: new Date().toISOString()
    });
    return docRef.id;
  },

  async updateItemStatus(id: string, status: ItemStatus) {
    const docRef = doc(db, ITEMS_COLLECTION, id);
    await updateDoc(docRef, { status });
  },

  async deleteItem(id: string) {
    const docRef = doc(db, ITEMS_COLLECTION, id);
    await deleteDoc(docRef);
  },

  // Comments
  async getComments(itemId: string) {
    const q = query(
      collection(db, COMMENTS_COLLECTION),
      where('itemId', '==', itemId),
      orderBy('createdAt', 'asc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Comment));
  },

  async addComment(commentData: Omit<Comment, 'id' | 'createdAt'>) {
    const docRef = await addDoc(collection(db, COMMENTS_COLLECTION), {
      ...commentData,
      createdAt: new Date().toISOString()
    });
    return docRef.id;
  },

  async saveUser(user: any) {
    const docRef = doc(db, 'users', user.uid);
    try {
      await updateDoc(docRef, {
        email: user.email,
        displayName: user.displayName,
        lastLogin: new Date().toISOString()
      });
    } catch (e: any) {
      if (e.code === 'not-found') {
        const { setDoc } = await import('firebase/firestore');
        await setDoc(docRef, {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString()
        });
      }
    }
  },

  async getAllUsers() {
    const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data());
  },

  async getSiteSettings() {
    try {
      const docRef = doc(db, 'settings', 'siteSettings');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data();
      }
    } catch (e) {
      console.warn('Failed to fetch settings:', e);
    }
    return {
      contactEmail: 'support@ruet.ac.bd',
      contactPhone: '+880 1234 567890',
      aboutText: 'RUET Lost & Found is a community-driven platform to help students and staff find their lost belongings.',
      logoText: 'RUET L&F'
    };
  },

  async updateSiteSettings(settings: any) {
    const { setDoc } = await import('firebase/firestore');
    const docRef = doc(db, 'settings', 'siteSettings');
    await setDoc(docRef, settings, { merge: true });
  },

  // Dynamic Home Page Data
  async getHomeStats() {
    try {
      const itemsCol = collection(db, ITEMS_COLLECTION);
      const totalSnapshot = await getCountFromServer(itemsCol);
      const resolvedQuery = query(itemsCol, where('status', '==', 'resolved'));
      const resolvedSnapshot = await getCountFromServer(resolvedQuery);
      
      const activeQuery = query(itemsCol, where('status', '==', 'active'));
      const activeSnapshot = await getCountFromServer(activeQuery);

      return {
        totalItems: totalSnapshot.data().count,
        resolvedItems: resolvedSnapshot.data().count,
        activeItems: activeSnapshot.data().count
      };
    } catch (error) {
      console.warn("Firestore error (getHomeStats):", error);
      return { totalItems: 0, resolvedItems: 0, activeItems: 0 };
    }
  },

  async getSuccessStories() {
    try {
      const q = query(
        collection(db, ITEMS_COLLECTION),
        where('status', '==', 'resolved'),
        orderBy('createdAt', 'desc'),
        limit(2)
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Item));
    } catch (error) {
      console.warn("Firestore error (getSuccessStories):", error);
      return [];
    }
  },

  async getGraphData() {
    try {
      const q = query(collection(db, ITEMS_COLLECTION), orderBy('createdAt', 'asc'));
      const snapshot = await getDocs(q);
      const items = snapshot.docs.map(doc => doc.data() as Item);
      
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const dataMap: Record<string, { name: string, found: number, lost: number }> = {};
      
      // Initialize last 6 months
      const today = new Date();
      for (let i = 5; i >= 0; i--) {
        const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
        const monthName = months[d.getMonth()];
        dataMap[monthName] = { name: monthName, found: 0, lost: 0 };
      }
      
      items.forEach(item => {
        const d = new Date(item.createdAt);
        const monthName = months[d.getMonth()];
        if (dataMap[monthName]) {
          if (item.type === 'found') dataMap[monthName].found++;
          if (item.type === 'lost') dataMap[monthName].lost++;
        }
      });
      
      return Object.values(dataMap);
    } catch (error) {
      console.warn("Firestore error (getGraphData):", error);
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
      return months.map(m => ({ name: m, found: 0, lost: 0 }));
    }
  }
};
