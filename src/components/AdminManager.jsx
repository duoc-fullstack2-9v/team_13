import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { doc, setDoc, deleteDoc, updateDoc, collection, query, where, getDocs, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../contexts/AuthContext';
import '../styles/AdminManager.css';

const AdminManager = () => {
  const { user, loading } = useAuth();
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminName, setNewAdminName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  if (loading) {
    return (
      <div className="admin-manager">
        <p>Cargando...</p>
      </div>
    );
  }

  if (!user || !user.isAdmin) {
    return <Navigate to="/" replace />;
  }

  const addAdmin = async (e) => {
    e.preventDefault();
    
    if (!newAdminEmail || !newAdminName) {
      setMessage('❌ Todos los campos son obligatorios');
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      // Crear documento en la colección 'admins'
      await setDoc(doc(db, 'admins', newAdminEmail), {
        email: newAdminEmail,
        displayName: newAdminName,
        isActive: true,
        createdAt: serverTimestamp(),
        permissions: ['products', 'users', 'sales', 'reports']
      });

      // También actualizar userType en la colección 'users' si existe
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('email', '==', newAdminEmail));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        await updateDoc(doc(db, 'users', userDoc.id), {
          userType: 'admin'
        });
        console.log('✅ UserType actualizado en colección users');
      }

      setMessage(`✅ Admin agregado: ${newAdminEmail}`);
      setNewAdminEmail('');
      setNewAdminName('');
    } catch (error) {
      console.error('Error agregando admin:', error);
      setMessage(`❌ Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const removeAdmin = async (email) => {
    if (!email) return;
    
    if (!window.confirm(`¿Eliminar admin: ${email}?`)) return;

    setIsLoading(true);
    setMessage('');

    try {
      await deleteDoc(doc(db, 'admins', email));
      setMessage(`✅ Admin eliminado: ${email}`);
    } catch (error) {
      console.error('Error eliminando admin:', error);
      setMessage(`❌ Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="admin-manager">
      <h2>🔧 Gestión de Administradores</h2>
      
      {message && (
        <div className={`message ${message.includes('✅') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}

      <form onSubmit={addAdmin} className="admin-form">
        <h3>Agregar Nuevo Administrador</h3>
        
        <div className="form-group">
          <label>Email del Administrador:</label>
          <input
            type="email"
            value={newAdminEmail}
            onChange={(e) => setNewAdminEmail(e.target.value)}
            placeholder="admin@gmail.com"
            disabled={isLoading}
          />
        </div>
        
        <div className="form-group">
          <label>Nombre Completo:</label>
          <input
            type="text"
            value={newAdminName}
            onChange={(e) => setNewAdminName(e.target.value)}
            placeholder="Nombre del Administrador"
            disabled={isLoading}
          />
        </div>
        
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Agregando...' : 'Agregar Admin'}
        </button>
      </form>

      <div className="quick-actions">
        <h3>Acciones Rápidas</h3>
        <p>Para eliminar un admin, usa la consola de Firebase o agrega la funcionalidad aquí.</p>
        
        <div className="admin-examples">
          <h4>Ejemplos de administradores que puedes agregar:</h4>
          <ul>
            <li>tu-email@gmail.com</li>
            <li>sebastian@duoc.cl</li>
            <li>admin@empresa.com</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminManager;
