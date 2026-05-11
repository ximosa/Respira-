# Respira+ | Tu Pausa Consciente 🌬️

**Respira+** es una aplicación PWA (Progressive Web App) moderna diseñada para mejorar el bienestar mental a través de la respiración guiada, sonidos para dormir, temporizadores de concentración y recuperación física. 

Construida con un enfoque **mobile-first**, ofrece una experiencia fluida, minimalista y premium inspirada en los estándares de diseño de Apple y Nothing.

## ✨ Características Principales

- **Respiración Guiada**: Modos Cuadrada, 4-7-8, Enfoque y Profunda con guías visuales animadas.
- **Mezclador de Sonidos**: Combina sonidos ambientales (Lluvia, Bosque, Océano) con temporizador de apagado.
- **Foco (Pomodoro)**: Temporizador estético para mejorar la productividad.
- **Recuperación Gym**: Cronómetro de descanso entre series con tips de respiración.
- **Offline Ready**: Gracias a Service Workers, la app funciona sin conexión una vez instalada.
- **Diseño Inmersivo**: Fondos dinámicos con gradientes animados y efectos de cristal (Glassmorphism).

## 🚀 Tecnologías

- **React 19** + **Vite 6**
- **Tailwind CSS 4** (Estilizado moderno)
- **Framer Motion** (Animaciones a 60fps)
- **Howler.js** (Gestión de audio profesional)
- **Lucide React** (Iconografía minimalista)
- **Vite PWA Plugin** (Configuración completa de PWA)

---

## 📖 Tutorial de Uso

### 1. Respiración
Selecciona un modo en la parte inferior. Presiona el botón central para comenzar. Sigue el círculo: cuando se expande, inhala; cuando se contrae, exhala.

### 2. Sueño y Sonidos
Activa los sonidos que prefieras tocando su icono. Ajusta el volumen individual con el slider. Configura el temporizador (ej. 30 min) para que los sonidos se detengan automáticamente mientras duermes.

### 3. Instalación PWA
Para disfrutar de la experiencia completa:
- **Android/Chrome**: Toca los tres puntos y selecciona "Instalar aplicación".
- **iOS/Safari**: Toca el botón "Compartir" y selecciona "Añadir a pantalla de inicio".

---

## 🛠️ Cómo subir a GitHub Pages

La aplicación está preparada para ser desplegada fácilmente mediante **GitHub Actions**.

### Paso 1: Configurar el Repositorio
1. Crea un nuevo repositorio en GitHub.
2. Sube tu código:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/TU_USUARIO/respira-plus.git
   git push -u origin main
   ```

### Paso 2: Configurar GitHub Pages
1. Ve a la pestaña **Settings** de tu repositorio en GitHub.
2. En el menú lateral, selecciona **Pages**.
3. En **Build and deployment** > **Source**, selecciona **GitHub Actions**.

### Paso 3: Crear el Workflow de Despliegue
Crea un archivo en `.github/workflows/deploy.yml` con el siguiente contenido:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      - run: npm install
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

### Paso 4: Ajustar la Base de la URL
Si tu repositorio no es el principal (ej: `usuario.github.io/respira-plus`), asegúrate de que en `vite.config.ts` el campo `base` sea:
`base: '/respira-plus/'`

---

## 📈 Roadmap Futuro
- [ ] Integración con Apple Health / Google Fit.
- [ ] Sincronización en la nube de estadísticas.
- [ ] Más paisajes sonoros de alta fidelidad.
- [ ] Modos de meditación guiada por voz (Gemini AI).

---
Desarrollado con ❤️ para un mundo más calmado.
