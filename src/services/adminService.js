import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';

class AdminService {
  // Verificar si un email es administrador
  async isAdmin(email) {
    try {
      if (!email) return false;
      
      // PRIMERO: Buscar en la colección 'users' por userType='admin'
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('email', '==', email));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const userData = userDoc.data();
        
        // Si el userType es 'admin', es administrador
        if (userData.userType === 'admin') {
          return true;
        }
      }
      
      // SEGUNDO: Buscar en la colección 'admins' (compatibilidad con sistema antiguo)
      const adminDoc = await getDoc(doc(db, 'admins', email));
      
      if (adminDoc.exists()) {
        const adminData = adminDoc.data();
        return adminData.isActive === true;
      }
      
      return false;
    } catch (error) {
      console.error('Error verificando admin:', error);
      return false;
    }
  }

  // Obtener permisos del administrador
  async getAdminPermissions(email) {
    try {
      if (!email) return [];
      
      const adminDoc = await getDoc(doc(db, 'admins', email));
      
      if (adminDoc.exists()) {
        const adminData = adminDoc.data();
        return adminData.permissions || [];
      }
      
      return [];
    } catch (error) {
      console.error('Error obteniendo permisos admin:', error);
      return [];
    }
  }

  // Obtener todos los administradores
  async getAllAdmins() {
    try {
      // Implementar si necesitas listar todos los admins
      return [];
    } catch (error) {
      console.error('Error obteniendo admins:', error);
      return [];
    }
  }
}

export default new AdminService();