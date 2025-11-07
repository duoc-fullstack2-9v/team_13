# 🔧 CONFIGURACIÓN DE ADMINISTRADORES FIREBASE

## 📋 PASOS PARA CREAR ADMINISTRADORES REALES:

### Opción 1: Usar la interfaz web (Recomendado)
1. Ve a: http://localhost:3000/setup-admins
2. Agrega tu email como administrador
3. Prueba el login con tu cuenta de Google real

### Opción 2: Crear manualmente en Firebase Console
1. Ve a: https://console.firebase.google.com
2. Selecciona tu proyecto "Pasteleria Mil Sabores"
3. Ve a "Firestore Database"
4. Crear nueva colección: `admins`
5. Agregar documento con ID = tu email:
   ```
   Documento ID: tu-email@gmail.com
   Campos:
   - email: "tu-email@gmail.com"
   - displayName: "Tu Nombre"
   - isActive: true
   - createdAt: (timestamp)
   - permissions: ["products", "users", "sales", "reports"]
   ```

### Opción 3: Usar script automático
1. Edita el archivo `setup-admins.js`
2. Cambia los emails por los tuyos
3. Ejecuta: `node setup-admins.js`

## ✅ VERIFICACIÓN:

Después de crear un admin:
1. Ve a http://localhost:3000
2. Click "Iniciar con Google"
3. Logueate con el email que agregaste como admin
4. Deberías ver "Mantenedor Productos" en el navbar

## 🎯 EMAILS DE EJEMPLO PARA AGREGAR:

- `tu-email@gmail.com` (tu cuenta personal)
- `sebastian@duoc.cl` (cuenta académica)
- `admin@empresa.com` (cuenta empresarial)

## 🔍 CÓMO FUNCIONA:

1. **Login**: Usuario se loguea con Google
2. **Consulta**: Sistema consulta colección `admins` en Firebase
3. **Verificación**: Si existe documento con su email → Admin
4. **Permisos**: Muestra/oculta opciones según tipo de usuario

## ⚠️ IMPORTANTE:

- Los administradores se determinan por consulta REAL a Firebase
- No hay emails hardcodeados en el código
- Sistema completamente dinámico y escalable
- Los permisos se almacenan en Firestore