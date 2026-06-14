# Spybee — Mapa de incidencias & Dashboard

Prueba técnica de Frontend (Next.js / React) para Spybee. La aplicación recrea el flujo de **creación de incidencias sobre un mapa** de una obra de construcción y un **dashboard** que resume el estado de esas incidencias.

## Acceso

La app cuenta con un flujo de autenticación (UI completa de login, registro y recuperación de contraseña), pero por ser una demo solo existe **un usuario válido**. Cualquier otra combinación de correo/contraseña muestra un mensaje de error y no permite el acceso. Las credenciales de prueba se comparten por aparte.

![Login](docs/screenshots/login.png)

## Stack

- **Next.js 16** (App Router, Turbopack, TypeScript, `src/`)
- **React 19**
- **Zustand** para estado global (sesión e incidencias)
- **react-map-gl / Mapbox GL** para el mapa
- **Recharts** para las visualizaciones del dashboard
- **SCSS Modules** para estilos, con variables y mixins compartidos en `src/styles/`
- **lucide-react** para iconografía

## Mapa de incidencias

Vista principal de la app (`/`). Muestra todas las incidencias del proyecto como marcadores sobre el mapa, coloreados según su prioridad/estado. Al hacer click en un marcador se abre un popup con el resumen de la incidencia.

![Mapa con zoom sobre los marcadores](docs/screenshots/map-overview.png)

Al hacer click en un marcador se abre un popup con el número de incidencia, título, descripción, etiquetas de estado/prioridad y ubicación dentro de la obra.

![Popup al hacer click en una incidencia](docs/screenshots/map-popup.png)

### Crear incidencia

Desde la barra superior del mapa se abre un modal con el formulario de creación: título, descripción, categoría, prioridad, ubicación (con selector de punto sobre el mapa), fecha límite, asignados/observadores, etiquetas y adjuntos.

![Modal de creación](docs/screenshots/create-incident-modal.png)

Al enviarlo, la incidencia se agrega al store de Zustand y aparece de inmediato en el mapa y en el dashboard (sin necesidad de recargar).

![Incidencia creada](docs/screenshots/create-incident-submitted.png)

## Dashboard

Vista `/dashboard`. Resume el estado general del proyecto con KPIs, indicadores de riesgo, gráficos de distribución, tendencia temporal, una tabla de incidencias críticas y métricas de desempeño del equipo. Todo es interactivo: los donuts y chips de indicadores filtran la tabla, el selector de periodo recalcula KPIs y tendencias, etc.

![Dashboard - vista general](docs/screenshots/dashboard-overview.png)

![Distribución por categoría y etiqueta](docs/screenshots/dashboard-distribution.png)

![Desempeño del equipo](docs/screenshots/dashboard-team.png)

![Calendario de actividad y mapa de calor](docs/screenshots/dashboard-calendar.png)

### Responsive

La app es usable en mobile y tablet (sidebar colapsable, KPIs y gráficos apilados).

![Dashboard mobile](docs/screenshots/mobile-dashboard.png)

## Estructura del proyecto

```
src/
  app/
    (app)/              # Rutas protegidas (mapa + dashboard), compartidas por AppShell
    login/              # Inicio de sesión
    register/           # Registro (demo, no crea usuarios reales)
    forgot-password/    # Recuperar contraseña (demo)
  components/
    auth/               # AuthLayout, AuthCard, AuthGuard, DroneSwarm (compartidos por las 3 vistas de auth)
    layout/             # AppShell, Header, Sidebar
    map/                # MapView, marcadores, popup, controles, top bar
    incidents/          # Modal de creación de incidencia y sus campos de formulario
    dashboard/          # KPIs, donuts, treemap, tablas, calendario, heatmap, etc.
  lib/                  # Lógica de datos: métricas del dashboard, opciones, colores, fechas
  store/                # Zustand: authStore (sesión) e incidentsStore (incidencias)
  styles/               # Variables y animaciones SCSS compartidas
  types/                # Tipos de dominio (Incident, IncidentUser, etc.)
data/
  incidents.mock.json   # Dataset de incidencias provisto para la prueba
```

## Decisiones técnicas y por qué

**Datos y estado (Zustand, sin backend).** Toda la app trabaja sobre `data/incidents.mock.json`, cargado una sola vez en `useIncidentsStore`. Crear una incidencia nueva simplemente la antepone al array en memoria — es lo más simple que cumple el requisito de "se ve reflejada al instante" sin montar un backend real. La sesión vive en `useAuthStore` con `persist`, para que el login sobreviva a un refresh.

**Mapa desacoplado de los datos.** `MapView` es un componente de presentación puro (recibe `markers`/`popup`/`children` como `ReactNode`); quien decide qué incidencias mostrar y cómo es la página que lo usa. Esto permite reusar el mapa tanto en la vista principal como en el selector de ubicación del formulario de creación, sin duplicar la configuración de Mapbox.

**Métricas del dashboard centralizadas en `lib/dashboardMetrics.ts`.** Todos los cálculos (conteos por estado/prioridad, tendencia, incidencias críticas, rankings de equipo, comparación entre periodos, etc.) son funciones puras que reciben el array de incidencias. Así los componentes del dashboard solo renderizan, y la lógica de negocio queda en un solo lugar.

**"Críticas para hoy" con criterio acotado.** En vez de marcar como crítica cualquier incidencia de prioridad alta, la tabla muestra solo las que están **vencidas o vencen en los próximos 3 días** — es el criterio que realmente requiere atención inmediata y evita saturar la tabla con todo el backlog de alta prioridad.

**SCSS Modules + variables compartidas.** Cada componente tiene su propio `.module.scss` (sin colisión de clases), pero todos importan `src/styles/_variables.scss` (`@use "..." as *`) para colores, espaciados, radios y breakpoints — así la paleta y el sistema de diseño son consistentes sin un framework de UI completo.

**Autenticación de un solo usuario.** El brief no pedía un backend de auth real, así que se optó por una validación simple en el cliente contra un usuario fijo (`CURRENT_USER` + `DEMO_PASSWORD` en `lib/incidentOptions.ts`). Registro y "olvidé mi contraseña" tienen UI completa y funcional en cuanto a flujo/validaciones, pero son demostrativos (no crean cuentas reales).

**Imágenes con `next/image`.** Avatares (incluyendo los remotos de `i.pravatar.cc`, configurados en `next.config.ts`) y logos usan `next/image` para optimización automática; la única excepción es la previsualización de archivos subidos en el formulario de creación, que usa `blob:` URLs locales (no soportadas por el optimizador de imágenes).

## Correr el proyecto

```bash
npm install
cp .env.local.example .env.local   # agregar tu NEXT_PUBLIC_MAPBOX_TOKEN
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000).
