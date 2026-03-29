/**
 * templates/index.ts — Selección de template Mixtli v2
 *
 * ALGORITMO SIMPLIFICADO:
 * 1. Cada sector tiene 3 templates asignados: base, siEnergetico (E≥4), siFormal (F≥4)
 * 2. Si el cliente NO dio adjetivos → se usa el template BASE del sector
 * 3. Si el cliente DIO adjetivos → calcular E/F desde design-system.md §2:
 *    a. Formalidad ≥ 4 (prioridad) → template FORMAL del sector
 *    b. Energía ≥ 4 → template ENERGÉTICO del sector
 *    c. Ambos < 4 → template BASE
 * 4. Sector no reconocido → fallback T2
 *
 * IMPORTANTE: Los defaults de E/F en design-system.md §2 son SOLO para CSS
 * (font-weight, border-radius, spacing, tono). NO afectan template selection.
 */

export const TEMPLATES = {
  T1: {
    archivo: 'T1-CinemaVisual.astro',
    nombre: 'Cinema Visual',
    intencion: 'Mi trabajo habla por las imágenes',
    componentes: [
      'NavbarFlotante',
      'HeroCinema',         // supratitulo + stats bar + 2 CTAs
      'ServiciosGrid',
      'Gallery',            // mín. 5 fotos reales o generadas
      'SocialProofResenas', // solo si hay reseñas reales
      'CTAPrincipal',
      'ContactoWhatsApp',
      'Footer',
    ],
    requiereImagenes: true,
    requiereDatoReal: true,
    requiereUbicacion: false,
  },
  T2: {
    archivo: 'T2-SplitProfesional.astro',
    nombre: 'Split Profesional',
    intencion: 'Credibilidad antes que ventas',
    componentes: [
      'NavbarFlotante',
      'HeroSplit',          // foto profesional + stats flotantes + 2 CTAs
      'ServiciosList',
      'ProcesoPasos',
      'FAQAccordion',
      'ContactoFormulario',
      'Footer',
    ],
    requiereImagenes: true,
    requiereDatoReal: true,
    requiereUbicacion: false,
  },
  T3: {
    archivo: 'T3-PrecioAlFrente.astro',
    nombre: 'Precio Al Frente',
    intencion: 'El cliente decide por precio — dárselo inmediato',
    componentes: [
      'NavbarFlotante',
      'HeroMinimal',        // headline + badge precio + 2 CTAs
      'ServiciosList',      // INMEDIATAMENTE después del hero
      'SocialProofResenas', // solo si hay reseñas reales
      'ContactoWhatsApp',
      'Footer',
    ],
    requiereImagenes: false,
    requiereDatoReal: false,
    requiereUbicacion: false,
  },
  T4: {
    archivo: 'T4-Narrativo.astro',
    nombre: 'Narrativo',
    intencion: 'Tenemos historia y personalidad',
    componentes: [
      'NavbarFlotante',
      'HeroCinema',         // 70vh compacto + supratitulo
      'HistoriaFilosofia',  // solo si hay cita/historia real
      'ServiciosTabbed',    // servicios agrupados por categoría
      'Gallery',            // mín. 5 fotos
      'SocialProofResenas', // solo si hay reseñas reales
      'CTAPrincipal',
      'ContactoWhatsApp',
      'Footer',
    ],
    requiereImagenes: true,
    requiereDatoReal: false,
    requiereUbicacion: false,
  },
  T5: {
    archivo: 'T5-LocalUrgente.astro',
    nombre: 'Local Urgente',
    intencion: 'Estoy cerca — el mapa es mi argumento',
    componentes: [
      'NavbarFlotante',
      'HeroMinimal',        // headline menciona ubicación
      'MapaProminente',     // mapa ANTES que servicios
      'ServiciosList',      // máx. 8 items
      'HorarioVisual',      // OBLIGATORIO
      'CTAPrincipal',
      'Footer',
    ],
    requiereImagenes: false,
    requiereDatoReal: true,
    requiereUbicacion: true,
  },
  T6: {
    archivo: 'T6-MinimalPremium.astro',
    nombre: 'Minimal Premium',
    intencion: 'Menos palabras, más peso. Exclusividad.',
    componentes: [
      'NavbarFlotante',
      'HeroMinimal',        // sin badge — headline corto
      'ServiciosGrid',      // máx. 6 servicios
      'SocialProofLogos',   // logos clientes/certs — omitir si no hay
      'ProcesoTimeline',    // con etiquetas de tiempo
      'FAQAccordion',
      'ContactoFormulario', // email obligatorio
      'Footer',
    ],
    requiereImagenes: false,
    requiereDatoReal: false,
    requiereUbicacion: false,
  },
} as const;

// ─── CONFIGURACIÓN POR SECTOR (26 sectores) ─────────────────────────────────
//
// Cada sector define 3 templates:
//   base          → cuando no hay adjetivos O cuando E y F están en rango neutro (1-3)
//   siEnergetico  → cuando el cliente da adjetivos que resultan en E ≥ 4
//   siFormal      → cuando el cliente da adjetivos que resultan en F ≥ 4 (prioridad sobre E)

type SectorConfig = {
  base: keyof typeof TEMPLATES;
  siEnergetico: keyof typeof TEMPLATES;
  siFormal: keyof typeof TEMPLATES;
};

export const sectorConfig: Record<string, SectorConfig> = {
  // ── Belleza y cuidado personal ──────────────────────────────────────────────
  barberia_tradicional:  { base: 'T1', siEnergetico: 'T1', siFormal: 'T2' },
  //                       visual (cortes)  |  ya es visual  |  maestro barbero → credenciales
  barberia_moderna:      { base: 'T1', siEnergetico: 'T1', siFormal: 'T6' },
  //                       fades y diseño  |  ya es visual  |  barbería upscale
  belleza_spa:           { base: 'T4', siEnergetico: 'T1', siFormal: 'T6' },
  //                       historia + experiencia  |  galería de transformaciones  |  spa de lujo
  estetica_general:      { base: 'T4', siEnergetico: 'T1', siFormal: 'T6' },
  //                       narrativo + galería  |  portafolio visual  |  salón premium
  nail_salon:            { base: 'T1', siEnergetico: 'T1', siFormal: 'T4' },
  //                       VISUAL (nail art = fotos)  |  ya es visual  |  nail art premium narrativo
  tatuajes_piercing:     { base: 'T1', siEnergetico: 'T1', siFormal: 'T4' },
  //                       portafolio = CV  |  ya es visual  |  estudio boutique

  // ── Salud y bienestar ───────────────────────────────────────────────────────
  consultorio_dental:    { base: 'T2', siEnergetico: 'T1', siFormal: 'T6' },
  //                       credenciales primero  |  clínica moderna con galería  |  clínica de especialidad
  consultorio_medico:    { base: 'T2', siEnergetico: 'T2', siFormal: 'T6' },
  //                       credenciales + proceso  |  se mantiene profesional  |  clínica privada premium
  veterinaria:           { base: 'T2', siEnergetico: 'T1', siFormal: 'T6' },
  //                       confianza vía credenciales  |  fotos de pacientes  |  hospital veterinario
  gym_fitness:           { base: 'T1', siEnergetico: 'T1', siFormal: 'T2' },
  //                       transformaciones visuales  |  ya es visual  |  club deportivo formal

  // ── Educación ───────────────────────────────────────────────────────────────
  educacion_capacitacion: { base: 'T2', siEnergetico: 'T1', siFormal: 'T6' },
  //                        credibilidad del instructor  |  fotos de alumnos/talleres  |  academia premium

  // ── Comida y bebida ─────────────────────────────────────────────────────────
  restaurante_formal:    { base: 'T4', siEnergetico: 'T1', siFormal: 'T6' },
  //                       historia + galería de platillos  |  fotos wow  |  fine dining
  comida_rapida:         { base: 'T5', siEnergetico: 'T1', siFormal: 'T4' },
  //                       ubicación + horario  |  fotos de comida  |  local establecido
  comida:                { base: 'T5', siEnergetico: 'T1', siFormal: 'T4' },
  //                       taquería/fonda local  |  fotos del producto  |  fonda con historia
  panaderia_cafeteria:   { base: 'T4', siEnergetico: 'T1', siFormal: 'T6' },
  //                       historia del lugar  |  fotos del producto  |  cafetería artesanal premium

  // ── Servicios profesionales ─────────────────────────────────────────────────
  abogado:               { base: 'T6', siEnergetico: 'T2', siFormal: 'T6' },
  //                       autoridad + proceso  |  más credenciales visibles  |  ya es premium
  contador:              { base: 'T2', siEnergetico: 'T2', siFormal: 'T6' },
  //                       credenciales + proceso  |  se mantiene profesional  |  despacho premium
  arquitecto_disenador:  { base: 'T1', siEnergetico: 'T1', siFormal: 'T6' },
  //                       portafolio visual  |  ya es visual  |  despacho premium
  agencia_digital:       { base: 'T2', siEnergetico: 'T1', siFormal: 'T6' },
  //                       proceso + resultados  |  portafolio de proyectos  |  agencia enterprise
  servicios_profesionales: { base: 'T2', siEnergetico: 'T1', siFormal: 'T6' },
  //                         proceso + credenciales  |  más visual  |  consultoría premium

  // ── Retail y comercio ───────────────────────────────────────────────────────
  tienda_ropa:           { base: 'T1', siEnergetico: 'T1', siFormal: 'T6' },
  //                       lookbook visual  |  ya es visual  |  boutique premium
  vendedor_catalogo:     { base: 'T3', siEnergetico: 'T3', siFormal: 'T3' },
  //                       precio es todo — siempre T3

  // ── Creativos y eventos ─────────────────────────────────────────────────────
  fotografia:            { base: 'T1', siEnergetico: 'T1', siFormal: 'T6' },
  //                       portafolio = el negocio  |  ya es visual  |  estudio de autor
  eventos_bodas:         { base: 'T4', siEnergetico: 'T1', siFormal: 'T6' },
  //                       aspiracional + emocional  |  galería de eventos  |  wedding planner premium

  // ── Inmuebles ───────────────────────────────────────────────────────────────
  inmobiliaria:          { base: 'T2', siEnergetico: 'T4', siFormal: 'T6' },
  //                       proceso + confianza  |  propiedades con narrativa  |  inmobiliaria premium

  // ── Fallback (sector no reconocido) ─────────────────────────────────────────
  _fallback:             { base: 'T2', siEnergetico: 'T1', siFormal: 'T6' },
  //                       T2 es el fallback más seguro: credenciales + servicios + FAQ + contacto
};

// ─── FUNCIÓN DE SELECCIÓN ─────────────────────────────────────────────────────

/**
 * Selecciona el template correcto para un sector.
 *
 * @param sector - Uno de los 26 sectores o string desconocido
 * @param energia - Promedio E de los adjetivos del cliente (1-5), o null si no dio adjetivos
 * @param formalidad - Promedio F de los adjetivos del cliente (1-5), o null si no dio adjetivos
 *
 * REGLAS:
 * - Sin adjetivos (null) → template BASE del sector
 * - F ≥ 4 tiene prioridad sobre E ≥ 4
 * - Sector desconocido → usa _fallback (base T2)
 */
export function seleccionarTemplate(
  sector: string,
  energia: number | null,
  formalidad: number | null,
): keyof typeof TEMPLATES {
  const config = sectorConfig[sector] ?? sectorConfig._fallback;

  // Sin adjetivos → base del sector directamente
  if (energia === null || formalidad === null) {
    return config.base;
  }

  // Formalidad alta tiene prioridad
  if (formalidad >= 4) return config.siFormal;

  // Energía alta
  if (energia >= 4) return config.siEnergetico;

  // Rango neutro (E 1-3, F 1-3)
  return config.base;
}

// ─── EJEMPLOS ─────────────────────────────────────────────────────────────────
//
// Sin adjetivos (el caso más común):
//   seleccionarTemplate('nail_salon', null, null)         → 'T1' (Cinema Visual — muestra nail art)
//   seleccionarTemplate('consultorio_dental', null, null) → 'T2' (Split Profesional — credenciales)
//   seleccionarTemplate('abogado', null, null)            → 'T6' (Minimal Premium — autoridad)
//   seleccionarTemplate('comida', null, null)             → 'T5' (Local Urgente — ubicación)
//
// Con adjetivos del cliente:
//   seleccionarTemplate('nail_salon', 4, 2)         → 'T1' (energético → Cinema Visual)
//   seleccionarTemplate('nail_salon', 2, 4)         → 'T4' (formal → Narrativo premium)
//   seleccionarTemplate('nail_salon', 2, 2)         → 'T1' (neutro → base Cinema Visual)
//
//   seleccionarTemplate('consultorio_dental', 3, 4) → 'T6' (formal → Minimal Premium)
//   seleccionarTemplate('consultorio_dental', 4, 2) → 'T1' (energético → Cinema Visual)
//   seleccionarTemplate('consultorio_dental', 2, 2) → 'T2' (neutro → base Split Profesional)
//
//   seleccionarTemplate('negocio_raro', 3, 3)       → 'T2' (fallback → Split Profesional)
