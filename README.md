# App-Kimce

Plataforma interna de Kimce Studio diseñada para centralizar la operación diaria de un equipo creativo. El sistema integra registro de horarios, control de asistencia y administración de solicitudes especiales de forma transparente entre colaboradores y administradores.

## Objetivos principales

- Optimizar el registro y cálculo de las horas trabajadas frente a las horas esperadas.
- Permitir que cada colaborador gestione con claridad sus marcaciones, descansos y solicitudes.
- Proveer al equipo administrativo indicadores en tiempo real sobre puntualidad, horas extra y deuda de horas.
- Reducir la carga operativa del equipo admin mediante automatizaciones, reglas de validación y flujos de aprobación.

## Entornos

| Entorno | Descripción |
| --- | --- |
| Portal Colaborador | Espacio operativo diario para registrar entrada, descanso y salida, revisar el balance semanal y enviar solicitudes. |
| Portal Admin | Consola central para gestionar feriados, aprobaciones, ajustes manuales, calendarios y reportes del equipo. |

## Funcionalidades generales

- Registro en tiempo real de entrada, descansos e instancias de salida con validaciones anti-doble marcación.
- Cálculo automático de horas trabajadas vs. horas esperadas, diferenciando deuda y horas a favor.
- Control integral de feriados, días libres, vacaciones, permisos y horas extra.
- Calendario integrado con vista mensual, semanal y por colaborador.
- Flujo completo de solicitudes y aprobaciones entre colaborador y admin con historial trazable.
- Panel de control para visualizar indicadores clave del equipo en tiempo real.

## Portal del colaborador

### Marcación diaria
- Marcar entrada, inicio/fin de descanso y salida respetando un flujo lógico.
- Validación automática para evitar doble registro o marcaciones incongruentes.
- Posibilidad de añadir observaciones por cada evento.

### Resumen semanal en la cabecera
- Tarjetas siempre visibles con horas trabajadas, esperadas y extra.
- Indicadores visuales verde/rojo según cumplimiento.
- Balance acumulado de horas a favor y horas faltantes sin necesidad de navegar a otra vista.

### Solicitudes disponibles
- Vacaciones con fechas específicas.
- Días libres compensatorios usando horas a favor.
- Permisos especiales con o sin goce.
- Registro de horas extra fuera de horario.
- Registro de actividades especiales (activaciones, grabaciones, reuniones, eventos, capacitaciones).
- Todas las solicitudes se envían al panel admin para su aprobación.

### Historial personal
- Listado de todas las marcaciones realizadas.
- Estado de aprobaciones de horas y actividades.
- Registro de vacaciones, días libres y uso de horas a favor.

### Control de jornada
- Los botones de entrada, descanso y salida se habilitan/deshabilitan según el flujo permitido.
- Una vez que se registra la salida, la jornada queda bloqueada hasta el día siguiente.
- Se muestran mensajes de ayuda cuando la jornada está cerrada para evitar errores.

## Portal Admin – Gestión completa

### Gestión de feriados y días especiales
- Crear, editar y eliminar feriados o días especiales.
- Asignar feriados a todo el equipo o a colaboradores específicos.
- Definir si el feriado es pagado o compensable y visualizarlo en el calendario anual.

### Aprobación de solicitudes
- Bandeja con solicitudes de vacaciones, permisos, horas extra, horas a favor y actividades especiales.
- Opciones para aprobar, rechazar o pedir correcciones.
- Al aprobar, los eventos se registran automáticamente en el calendario e historial del colaborador.

### Gestión de accesos por correo
- Cada colaborador inicia sesión con su email corporativo desde `/login`.
- El primer ingreso crea una solicitud de acceso que queda “pendiente” hasta que el admin la apruebe.
- El panel admin permite aprobar, denegar o volver a bloquear un correo con un clic, asignando además el puesto y el rol (admin o colaborador).
- El historial muestra cuándo se creó la solicitud y la última revisión para auditoría.

### Gestión de horas del equipo
- Ajustes manuales para súper admins: sumar/restar horas a favor y corregir marcaciones.
- Registro de días libres compensatorios y rectificación de entradas/salidas erróneas.

### Calendario general
- Calendario consolidado con entradas/salidas, vacaciones, feriados y actividades especiales.
- Filtros por mes, colaborador o tipo de evento para facilitar la planificación.

### Panel de control
- Solicitudes pendientes y estado de cada flujo.
- Horas a favor y faltantes del equipo completo.
- Ranking de puntualidad y horas extra por proyecto o actividad.
- Estadísticas mensuales con evolución del equipo.

### Historial por colaborador
- Detalle diario, semanal y mensual de horas trabajadas.
- Registro de días libres, vacaciones y permisos.
- Historial de actividades especiales y manejo de horas a favor (generadas vs. usadas).
- Exportación de reportes en Excel o PDF.

## Base de funciones automáticas

- Cálculo inteligente de horas trabajadas, esperadas, extras y faltantes.
- Conversión de horas extra a horas a favor según reglas definidas.
- Bloqueo automático de marcaciones durante vacaciones y autoregistro de feriados.
- Ajustes automáticos por descansos y validaciones para evitar flujos ilógicos (descansos múltiples por día, entrada/salida bloqueados tras cerrar la jornada).
- Las vacaciones, permisos y días compensatorios aprobados descuentan las horas esperadas de la semana, evitando que cuenten como deuda.

## Experiencia de usuario

**Colaboradores**
- Interfaz simple y visual con marcaciones rápidas.
- Resumen semanal claro y solicitudes en tres clics.
- Indicadores de progreso y saldo de horas disponibles.

**Administradores**
- Consola centralizada con bandeja de solicitudes y calendario completo.
- Estadísticas en tiempo real y control total sobre la operación.
- Automatizaciones que reducen errores y agilizan la gestión.

## Beneficios clave

- Gestión clara de horarios en un contexto creativo con activaciones especiales.
- Transparencia en el uso de horas extra y compensaciones.
- Información actualizada para decisiones operativas y de talento.
- Reducción de cálculos manuales y minimización de errores de registro.

## Implementación de referencia

El repositorio incluye una implementación Python ligera que modela todas las reglas anteriores:

- `app_kimce/models.py`: define colaboradores, solicitudes, feriados, entradas de tiempo y eventos de calendario.
- `app_kimce/portal.py`: encapsula las acciones disponibles para cada colaborador (marcaciones, solicitudes, indicadores semanales, historial, etc.).
- `app_kimce/admin.py`: concentra las herramientas administrativas para gestionar feriados, aprobar solicitudes, ajustar horas, construir calendarios y exportar historiales.
- `app_kimce/calendar.py`: genera vistas mensuales/por colaborador y carga general del equipo.
- `app_kimce/analytics.py`: ofrece métricas agregadas como horas trabajadas vs. esperadas, deuda/a favor y ranking de puntualidad.
- `demo.py`: script de ejemplo que crea dos colaboradores, simula marcaciones, cursa solicitudes y las aprueba para demostrar los flujos básicos.

### Requisitos

- Python 3.11+
- Dependencias listadas en `requirements.txt` (Flask para la UI y Gunicorn para despliegues productivos).

Instala todo con:

```bash
pip install -r requirements.txt
```

### Modos de uso

#### Demo en consola

```bash
python demo.py
```

El script instanciará los portales, realizará marcaciones, registrará solicitudes y mostrará en consola los indicadores clave tanto para colaboradores como para el panel admin.

#### UI web mínima

Se incluyó `webapp.py`, una aplicación Flask que renderiza la vista del colaborador y del admin usando las plantillas en `templates/`.

```bash
python webapp.py
```

El comando imprime la URL base una vez que el servidor está disponible.

Luego abre <http://localhost:5000> para:

- Revisar la “tarjeta” semanal de cada colaborador.
- Registrar marcaciones y generar solicitudes con formularios funcionales.
- Gestionar las solicitudes desde `/admin`, aprobar/rechazar y agregar feriados con formularios reales.
- Visualizar el calendario mensual y los indicadores de horas a favor/deuda en tiempo real.

El servidor usa datos demo en memoria y sirve como base para iterar el diseño visual o conectar un backend persistente más adelante.

##### Compartirlo mediante un enlace

Si quieres que otras personas lo vean desde su navegador, expón el servidor en toda la red local:

```bash
python webapp.py --host 0.0.0.0 --port 8080
```

La terminal mostrará la URL `http://0.0.0.0:8080` y, además, un enlace usando la IP real de tu máquina (por ejemplo `http://192.168.0.12:8080`). Comparte ese enlace dentro de tu red o reemplázalo por tu IP pública si necesitas acceso remoto (idealmente detrás de un túnel seguro como ngrok o Cloudflare Tunnel).

##### Desplegarlo en internet (Render/Railway)

Para que los colaboradores ingresen desde cualquier lugar, despliega `webapp.py` en un proveedor PaaS gratuito como Render o Railway:

1. **Crea el servicio web** apuntando a este repositorio o a un fork privado.
2. Define los comandos de build/start:

   ```bash
   # Build
   pip install -r requirements.txt

   # Start
   gunicorn webapp:app --bind 0.0.0.0:$PORT --log-level info
   ```

3. Configura la variable `FLASK_SECRET_KEY` y, si lo deseas, `PORT`.
4. Una vez desplegado, comparte la URL pública que entrega la plataforma (por ejemplo `https://kimce-demo.onrender.com`).

Puedes replicar la misma receta en Fly.io, Dokku u otro servidor Linux siempre que expongas el puerto HTTP, apuntes un dominio y uses HTTPS (Cloudflare o Let’s Encrypt) para proteger las credenciales.
