# Cobertura de Testing - Pastelería Mil Sabores (team_13)

Fecha: 2025-11-24  
Suite: Vitest + Testing Library (React)

## Resumen de ejecución
- Comando: `npm run test:coverage`
- Resultado: 14 archivos de prueba, 39 tests, todos pasaron.
- Notas: Se observan logs de error simulados en pruebas de formularios y API; son intencionales para validar manejo de errores y no indican fallos reales.

## Métricas de cobertura (v8)

| Módulo / Archivo          | Stmts | Branch | Funcs | Lines |
|---------------------------|-------|--------|-------|-------|
| **Total**                 | 86.13%| 70.73% | 89.47%| 87.06%|
| components                | 81.13%| 67.61% | 78.26%| 81.93%|
| ├─ CartIcon.jsx           | 88.88%| 83.33% | 66.66%| 88.88%|
| ├─ LoginForm.jsx          | 78.20%| 57.44% | 83.33%| 78.94%|
| └─ RegisterForm.jsx       | 83.33%| 73.91% | 75.00%| 84.28%|
| pages                     | 94.73%| 92.85% | 91.66%| 94.59%|
| ├─ ContactoPage.jsx       |100.00%|100.00% |100.00%|100.00%|
| ├─ LandingPage.jsx        |100.00%|100.00% |100.00%|100.00%|
| └─ ProductosPage.jsx      | 94.11%| 92.85% | 90.00%| 93.93%|
| utils                     | 97.56%| 75.00% |100.00%|100.00%|
| ├─ mockFirebase.js        |100.00%|100.00% |100.00%|100.00%|
| └─ validators.js          | 95.23%| 75.00% |100.00%|100.00%|

## Puntos de mejora sugeridos
- **Branches en formularios**: cubrir flujos de error adicionales en `LoginForm.jsx` y `RegisterForm.jsx` (validaciones y mensajes específicos).
- **CartIcon**: agregar casos de prueba para cambios de cantidad y vaciado de carrito para elevar funciones.
- **ProductosPage**: cubrir ramas de filtros adicionales o paginación si aplica.

## Cómo regenerar el reporte
```bash
npm install            # solo si cambian dependencias
npm run test:coverage  # genera cobertura v8 en consola
```

Si se requiere reporte HTML, agregar `--coverage.reporter=html` y revisar la carpeta `coverage/`.
