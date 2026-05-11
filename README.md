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

## 💻 Instalación Local

Para ejecutar Respira+ en tu propia máquina:

1. **Clona el repositorio**:
   ```bash
   git clone https://github.com/TU_USUARIO/respira-plus.git
   cd respira-plus
   ```

2. **Instala las dependencias**:
   ```bash
   npm install
   ```

3. **Inicia el servidor de desarrollo**:
   ```bash
   npm run dev
   ```
   La aplicación estará disponible en `http://localhost:3000`.

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

La forma más rápida de desplegar la aplicación es usando el script automatizado que ya viene configurado:

### 1. Configura el repositorio remoto
Si aún no lo has hecho:
```bash
git remote add origin https://github.com/TU_USUARIO/respira-plus.git
```

### 2. Ajusta la Base de la URL (Importante)
En `vite.config.ts`, asegúrate de que el campo `base` coincida con el nombre de tu repositorio para que los assets carguen correctamente:
`base: '/nombre-de-tu-repo/'`

### 3. Despliegue con un solo comando
Simplemente ejecuta:
```bash
npm run deploy
```
Este comando construirá la aplicación (`build`) y subirá el contenido de la carpeta `dist` automáticamente a la rama `gh-pages` de tu repositorio. GitHub Pages detectará esta rama y publicará tu sitio en cuestión de minutos.

---

## 📈 Roadmap Futuro
- [ ] Integración con Apple Health / Google Fit.
- [ ] Sincronización en la nube de estadísticas.
- [ ] Más paisajes sonoros de alta fidelidad.
- [ ] Modos de meditación guiada por voz (Gemini AI).

---
Desarrollado con ❤️ para un mundo más calmado.
