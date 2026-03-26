import { collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, query, where, orderBy } from 'firebase/firestore';
import { db } from './firebase';

// ============================================================================
// Error Handling
// ============================================================================
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo?: any;
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// ============================================================================
// Types
// ============================================================================
export interface ThemeConfig {
  backgroundColor: string;
  textColor: string;
  buttonColor: string;
  buttonTextColor: string;
}

export interface UserProfile {
  uid: string;
  username: string;
  name: string;
  bio?: string;
  profileImageUrl?: string;
  theme?: ThemeConfig;
  isPremium?: boolean;
}

export interface LinkItem {
  id?: string;
  userId: string;
  title: string;
  url: string;
  isActive: boolean;
  order: number;
}

// ============================================================================
// User Operations
// ============================================================================

export async function createUserProfile(uid: string, data: UserProfile) {
  const path = `users/${uid}`;
  try {
    await setDoc(doc(db, 'users', uid), data);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const path = `users/${uid}`;
  try {
    const docSnap = await getDoc(doc(db, 'users', uid));
    if (docSnap.exists()) {
      return docSnap.data() as UserProfile;
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
    return null;
  }
}

export async function getUserByUsername(username: string): Promise<UserProfile | null> {
  const path = `users`;
  try {
    const q = query(collection(db, 'users'), where('username', '==', username));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      return querySnapshot.docs[0].data() as UserProfile;
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return null;
  }
}

export async function updateUserProfile(uid: string, data: Partial<UserProfile>) {
  const path = `users/${uid}`;
  try {
    await updateDoc(doc(db, 'users', uid), data);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

// ============================================================================
// Link Operations
// ============================================================================

export async function createLink(linkId: string, data: Omit<LinkItem, 'id'>) {
  const path = `links/${linkId}`;
  try {
    await setDoc(doc(db, 'links', linkId), data);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function getUserLinks(userId: string): Promise<LinkItem[]> {
  const path = `links`;
  try {
    const q = query(collection(db, 'links'), where('userId', '==', userId), orderBy('order', 'asc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as LinkItem[];
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return [];
  }
}

export async function updateLink(linkId: string, data: Partial<LinkItem>) {
  const path = `links/${linkId}`;
  try {
    await updateDoc(doc(db, 'links', linkId), data);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function deleteLink(linkId: string) {
  const path = `links/${linkId}`;
  try {
    await deleteDoc(doc(db, 'links', linkId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}
