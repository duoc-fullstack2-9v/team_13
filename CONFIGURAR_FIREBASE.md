# CONFIGURACIÓN STEP-BY-STEP DE FIREBASE

## 🚀 PASOS OBLIGATORIOS PARA FIREBASE REAL:

### 1. Crear Proyecto Firebase
1. Ve a: https://console.firebase.google.com
2. Click "Crear un proyecto"
3. Nombre: "Pasteleria Mil Sabores"
4. Habilitar Google Analytics: SÍ
5. Configurar Analytics: Default Account
6. Click "Crear proyecto"

### 2. Configurar Authentication
1. En el panel izquierdo: "Authentication"
2. Click "Get started"
3. Tab "Sign-in method"
4. Click en "Google"
5. Toggle "Enable" = ON
6. Project support email: TU EMAIL
7. Click "Save"

### 3. Configurar Firestore Database
1. En el panel izquierdo: "Firestore Database"
2. Click "Create database"
3. Start in "test mode" (por ahora)
4. Location: us-central1
5. Click "Done"

### 4. Obtener Configuración Web
1. En el panel principal, click en el icono web "<>"
2. App nickname: "Pasteleria Web"
3. Hosting: NO (por ahora)
4. Click "Register app"
5. COPIAR TODO EL OBJETO firebaseConfig

### 5. Configurar Dominio Autorizado
1. Volver a Authentication
2. Tab "Settings"
3. "Authorized domains"
4. Agregar: "localhost"

## 🔧 CONFIGURACIÓN QUE NECESITAS COPIAR:

Después de crear la app web, verás algo como:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "pasteleria-mil-sabores.firebaseapp.com",
  projectId: "pasteleria-mil-sabores",
  storageBucket: "pasteleria-mil-sabores.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456789012345678"
};
```

## ⚠️ IMPORTANTE:
- NUNCA compartas estas credenciales públicamente
- Son las credenciales REALES de tu proyecto
- Reemplaza los valores en el archivo .env