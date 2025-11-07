import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

class AdminService {
  // Verificar si un email es administrador
  async isAdmin(email) {
    try {
      if (!email) return false;
      
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