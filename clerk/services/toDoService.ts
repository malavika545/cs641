import { collection, query, orderBy, addDoc, updateDoc, deleteDoc, doc, where, getDocs, limit } from 'firebase/firestore';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import * as FileSystem from 'expo-file-system';
import { Todo } from '../types/todo';
import { db, storage } from '../config/firebaseConfig';
import { useUser, useAuth } from '@clerk/clerk-expo';

export class TodoService {
      user = useUser();


    static async getTodos(userId: string, limitCount?: number): Promise<Todo[]> {
        let q = query(
            collection(db, 'todos'),
            where('userId', '==', userId),
            orderBy('createdAt', 'desc')
        );

        if (limitCount) {
            q = query(q, limit(limitCount));
        }


        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt.toDate()
        } as Todo));
    }

    static async getStats(userId: string) {
        const todos = await this.getTodos(userId);
        const completed = todos.filter(todo => todo.completed).length;

        return {
            total: todos.length,
            completed,
            pending: todos.length - completed
        };
    }

    static async addTodo(userId: string, text: string, imageUri?: string): Promise<void> {

    
        let imageUrl: string | undefined;
    
        if (imageUri) {
          try {
            // Read the file as base64
            const base64 = await FileSystem.readAsStringAsync(imageUri, {
              encoding: FileSystem.EncodingType.Base64,
            });
    
            const imagePath = `todos/${userId}/${Date.now()}.jpg`;
            const storageRef = ref(storage, imagePath);
    
            // Upload the base64 string
            await uploadString(storageRef, base64, 'base64', {
              contentType: 'image/jpeg',
            });
    
            imageUrl = await getDownloadURL(storageRef);
            await addDoc(collection(db, 'todos'), {
              text,
              completed: false,
              createdAt: new Date(),
              userId,
              imageUrl,
            });
          } catch (error) {
            console.error('Error uploading image:', error);
            throw new Error('Failed to upload image');
          } 
        }else {
            await addDoc(collection(db, 'todos'), {
              text,
              completed: false,
              createdAt: new Date(),
              userId,
            });
          }
        


      }

    static async toggleTodo(todoId: string, completed: boolean): Promise<void> {
        const todoRef = doc(db, 'todos', todoId);
        await updateDoc(todoRef, { completed });
    }

    static async deleteTodo(todoId: string): Promise<void> {
        const todoRef = doc(db, 'todos', todoId);
        await deleteDoc(todoRef);
    }
}