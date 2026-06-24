# TPI-GRUPO13
El repositorio del grupo 13 para el TPI de PROG4.

## Ejecutar el backend

Las credenciales reales no están en `application.properties` ni en archivos subidos a Git.

1. Entrar a la carpeta del backend:

   ```powershell
   cd backend
   ```

2. Copiar el ejemplo de variables locales:

   ```powershell
   Copy-Item .env.example .env
   ```

3. Completar `.env` con las credenciales reales de Neon y una `JWT_SECRET_KEY` en Base64.

4. Ejecutar con Neon:

   ```powershell
   .\start.ps1
   ```

Para ejecutar sin Neon, usando H2 en memoria:

```powershell
cd backend
.\start.ps1 -Profile h2
```
