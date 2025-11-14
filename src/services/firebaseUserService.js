import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { 
  createUserWithEmailAndPassword,
  updateProfile,
  deleteUser as deleteFirebaseUser,
  updatePassword
} from 'firebase/auth';
import { db, auth } from '../firebase/config';

class FirebaseUserService {
  constructor() {
    this.usersCollection = 'users';
  }

  // Obtener todos los usuarios
  async getAllUsers() {
    try {
      const usersRef = collection(db, this.usersCollection);
      const q = query(usersRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const users = [];
      querySnapshot.forEach((doc) => {
        users.push({
          id: doc.id,
          ...doc.data(),
          fechaRegistro: doc.data().createdAt?.toDate?.() || new Date()
        });
      });
      
      return users;
    } catch (error) {
      console.error('Error al obtener usuarios de Firebase:', error);
      throw error;
    }
  }

  // Obtener usuario por ID
  async getUserById(userId) {
    try {
      const userDoc = await getDoc(doc(db, this.usersCollection, userId));
      if (userDoc.exists()) {
        return {
          id: userDoc.id,
          ...userDoc.data(),
          fechaRegistro: userDoc.data().createdAt?.toDate?.() || new Date()
        };
      }
      return null;
    } catch (error) {
      console.error('Error al obtener usuario por ID:', error);
      throw error;
    }
  }

  // Obtener usuario por email
  async getUserByEmail(email) {
    try {
      const usersRef = collection(db, this.usersCollection);
      const q = query(usersRef, where('email', '==', email));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        return {
          id: userDoc.id,
          ...userDoc.data(),
          fechaRegistro: userDoc.data().createdAt?.toDate?.() || new Date()
        };
      }
      return null;
    } catch (error) {
      console.error('Error al obtener usuario por email:', error);
      throw error;
    }
  }

  // Crear nuevo usuario
  async createUser(userData) {
    try {
      // Crear usuario en Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        userData.email, 
        userData.password
      );
      
      const user = userCredential.user;
      
      // Actualizar perfil con nombre
      if (userData.nombre) {
        await updateProfile(user, {
          displayName: `${userData.nombre} ${userData.apellido || ''}`.trim()
        });
      }

      // Crear documento en Firestore
      const userDocData = {
        email: userData.email,
        nombre: userData.nombre || '',
        apellido: userData.apellido || '',
        telefono: userData.telefono || '',
        fechaNacimiento: userData.fechaNacimiento || null,
        userType: userData.userType || 'customer',
        isAdmin: userData.userType === 'admin',
        provider: 'email',
        displayName: `${userData.nombre} ${userData.apellido || ''}`.trim(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        activo: true
      };

      await setDoc(doc(db, this.usersCollection, user.uid), userDocData);

      return {
        id: user.uid,
        ...userDocData,
        fechaRegistro: new Date()
      };
    } catch (error) {
      console.error('Error al crear usuario:', error);
      throw error;
    }
  }

  // Actualizar usuario
  async updateUser(userId, userData) {
    try {
      const updateData = {
        ...userData,
        updatedAt: serverTimestamp()
      };

      // Si se actualiza nombre o apellido, actualizar displayName
      if (userData.nombre || userData.apellido) {
        const currentUser = await this.getUserById(userId);
        const nombre = userData.nombre || currentUser?.nombre || '';
        const apellido = userData.apellido || currentUser?.apellido || '';
        updateData.displayName = `${nombre} ${apellido}`.trim();
      }

      await updateDoc(doc(db, this.usersCollection, userId), updateData);
      
      return await this.getUserById(userId);
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      throw error;
    }
  }

  // Eliminar usuario (soft delete)
  async deleteUser(userId) {
    try {
      await updateDoc(doc(db, this.usersCollection, userId), {
        activo: false,
        deletedAt: serverTimestamp()
      });
      
      return true;
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      throw error;
    }
  }

  // Activar/Desactivar usuario
  async toggleUserStatus(userId, activo) {
    try {
      await updateDoc(doc(db, this.usersCollection, userId), {
        activo: activo,
        updatedAt: serverTimestamp()
      });
      
      return await this.getUserById(userId);
    } catch (error) {
      console.error('Error al cambiar estado del usuario:', error);
      throw error;
    }
  }

  // Buscar usuarios por texto
  async searchUsers(searchTerm) {
    try {
      const users = await this.getAllUsers();
      
      if (!searchTerm) return users;
      
      const lowerSearchTerm = searchTerm.toLowerCase();
      
      return users.filter(user => 
        user.email?.toLowerCase().includes(lowerSearchTerm) ||
        user.nombre?.toLowerCase().includes(lowerSearchTerm) ||
        user.apellido?.toLowerCase().includes(lowerSearchTerm) ||
        user.displayName?.toLowerCase().includes(lowerSearchTerm)
      );
    } catch (error) {
      console.error('Error al buscar usuarios:', error);
      throw error;
    }
  }

  // Obtener estadísticas de usuarios
  async getUserStats() {
    try {
      const users = await this.getAllUsers();
      
      const stats = {
        total: users.length,
        activos: users.filter(u => u.activo !== false).length,
        inactivos: users.filter(u => u.activo === false).length,
        admins: users.filter(u => u.isAdmin).length,
        customers: users.filter(u => !u.isAdmin).length,
        porTipo: {
          admin: users.filter(u => u.userType === 'admin').length,
          customer: users.filter(u => u.userType === 'customer').length,
          guest: users.filter(u => u.userType === 'guest').length
        }
      };
      
      return stats;
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      throw error;
    }
  }
}

const firebaseUserService = new FirebaseUserService();
export default firebaseUserService;