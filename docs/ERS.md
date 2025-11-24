# ERS - Especificación de Requerimientos de Software
Pastelería Mil Sabores (team_13) – Frontend React + Vite

## 1. Propósito y alcance
- Proveer una aplicación web para venta de productos de pastelería con autenticación, carrito y gestión básica de pedidos.
- Usuarios objetivo: clientes finales, administradores/operadores y personal interno.

## 2. Definiciones
- **ERS**: Especificación de Requerimientos de Software.
- **Cliente**: usuario que navega, compra y consulta pedidos.
- **Admin**: usuario con permisos de gestión (productos, pedidos, usuarios).
- **Pedido anónimo**: compra sin cuenta (si la configuración lo permite).

## 3. Actores
- **Visitante**: navega catálogo y contacto sin autenticarse.
- **Cliente registrado**: compra, consulta pedidos y recibe beneficios.
- **Administrador/Operador**: gestiona catálogo y pedidos.
- **Servicios externos**: Firebase Auth y API backend (Spring Boot).

## 4. Requerimientos funcionales
1) Autenticación con email/contraseña y Google OAuth.  
2) Registro de usuario con validaciones y mensajes de error claros.  
3) Catálogo de productos con listado y filtros básicos.  
4) Carrito de compras: agregar, ajustar cantidad y eliminar ítems.  
5) Checkout y creación de pedido; mostrar confirmación y totales.  
6) Beneficios automáticos según reglas (ej. estudiantes Duoc, cupones).  
7) Historial/seguimiento de pedidos para usuario autenticado.  
8) Formulario de contacto validado y envío de mensaje.  
9) Panel administrativo: alta/edición/baja de productos; visualización de pedidos y usuarios (según rol).  
10) Integración con API backend para datos de productos, pedidos y usuarios; manejo de errores de red.  
11) Persistencia de sesión (Firebase) y manejo de expiración de credenciales.

## 5. Requerimientos no funcionales
- **Usabilidad**: interfaz responsiva y mensajes de error legibles.  
- **Disponibilidad**: la UI debe degradar con mensajes claros cuando no haya backend; caché opcional para catálogo.  
- **Rendimiento**: carga inicial < 3s en banda ancha típica; operaciones de carrito instantáneas en cliente.  
- **Seguridad**: uso de Firebase Auth; rutas privadas protegidas; sanitizar entradas.  
- **Compatibilidad**: navegadores modernos (Chrome/Edge/Firefox, móvil y escritorio).  
- **Mantenibilidad**: estructura modular y pruebas unitarias (Vitest) con cobertura objetivo ≥ 80% líneas.

## 6. Reglas de negocio
- Aplicar beneficios automáticos según perfil (estudiantes Duoc, cupones válidos).  
- Permitir pedidos sin registro si está habilitado; con registro se aplican descuentos/seguimiento.  
- Estados de pedido gestionados por backend (recibido, en preparación, listo/entregado).  
- Validar stock/errores del backend antes de confirmar compra y mostrar alertas.

## 7. Supuestos y dependencias
- Backend (Spring Boot) disponible con CORS habilitado.  
- Firebase Auth configurado con credenciales válidas.  
- Datos de productos/pedidos/usuarios provienen de la API; la app muestra errores cuando fallen.  
- El navegador del usuario permite cookies/localStorage para sesiones.

## 8. Fuera de alcance
- Pasarelas de pago reales (solo simulación).  
- Logística de despacho y tracking externo.  
- SLA formales de uptime y soporte.
