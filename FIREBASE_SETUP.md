# CONFIGURACIÓN DE FIREBASE REAL

## Pasos para configurar Firebase:

1. **Ir a Firebase Console**: https://console.firebase.google.com
2. **Crear nuevo proyecto**:
   - Nombre: "Pasteleria Mil Sabores"
   - Habilitar Google Analytics (opcional)

3. **Configurar Authentication**:
   - Ir a Authentication > Sign-in method
   - Habilitar Google Provider
   - Agregar dominio autorizado: localhost

4. **Configurar Firestore Database**:
   - Ir a Firestore Database
   - Crear base de datos en modo producción
   - Configurar reglas básicas

5. **Obtener configuración**:
   - Ir a Project Settings (engranaje)
   - Scroll down a "Your apps"
   - Click "Add app" > Web
   - Copiar la configuración

## Estructura de datos recomendada en Firestore:

### Colección: users
```
users/{uid}
{
  email: string,
  displayName: string,
  photoURL: string,
  userType: "admin" | "customer", // Tipo de usuario
  createdAt: timestamp,
  lastLogin: timestamp,
  // Datos adicionales del formulario de registro
  nombres: string,
  apellidos: string,
  telefono: string,
  fechaNacimiento: string,
  direccion: string
}
```

### Reglas de Firestore sugeridas:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read and write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Admins can read all users
    match /users/{userId} {
      allow read: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.userType == 'admin';
    }
  }
}
```

Una vez que tengas la configuración, actualiza el archivo .env con los valores reales.