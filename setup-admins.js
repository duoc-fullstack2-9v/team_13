// Script para crear usuarios administradores en Firebase
// Ejecuta este script una vez para crear usuarios admin

import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, serverTimestamp } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCA2OhOykZfzeIU_J_HRYMerH6yeTfP6Ew",
  authDomain: "pasteleria-mil-sabores-d522b.firebaseapp.com",
  projectId: "pasteleria-mil-sabores-d522b",
  storageBucket: "pasteleria-mil-sabores-d522b.firebasestorage.app",
  messagingSenderId: "53240624161",
  appId: "1:53240624161:web:7db20e86224eb8fcbe1f60"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Función para crear un usuario administrador
const createAdminUser = async (email, displayName) => {
  try {
    // Crear documento en la colección 'admins'
    await setDoc(doc(db, 'admins', email), {
      email: email,
      displayName: displayName,
      isActive: true,
      createdAt: serverTimestamp(),
      permissions: ['products', 'users', 'sales', 'reports']
    });

    console.log(`✅ Admin creado: ${email}`);
  } catch (error) {
    console.error(`❌ Error creando admin ${email}:`, error);
  }
};

// Ejecutar para crear admins
const setupAdmins = async () => {
  console.log('🔧 Configurando usuarios administradores...');
  
  // Agregar tus emails de admin aquí
  await createAdminUser('tu-email@gmail.com', 'Tu Nombre Admin');
  await createAdminUser('sebastian@gmail.com', 'Sebastian Admin');
  
  console.log('✅ Administradores configurados');
};

// Descomentar la siguiente línea para ejecutar
// setupAdmins();