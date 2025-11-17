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

### MyWeekCard
- Resumen semanal de horas trabajadas, esperadas y extras.
- Visualización de horas faltantes (deuda) y horas a favor acumuladas.
- Indicadores visuales verde/rojo según cumplimiento.
- Selector de semana, mes o vista completa.

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

## Portal Admin – Gestión completa

### Gestión de feriados y días especiales
- Crear, editar y eliminar feriados o días especiales.
- Asignar feriados a todo el equipo o a colaboradores específicos.
- Definir si el feriado es pagado o compensable y visualizarlo en el calendario anual.

### Aprobación de solicitudes
- Bandeja con solicitudes de vacaciones, permisos, horas extra, horas a favor y actividades especiales.
- Opciones para aprobar, rechazar o pedir correcciones.
- Al aprobar, los eventos se registran automáticamente en el calendario e historial del colaborador.

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
- Ajustes automáticos por descansos y validaciones para evitar flujos ilógicos.

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
