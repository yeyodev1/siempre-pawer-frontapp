/**
 * El copy es configuración: todos los textos y datos de la marca viven acá.
 * Los componentes solo consumen y pintan.
 */
export const site = {
  name: 'PAWER',
  seoTitle: 'PAWER | Tienda de implementos deportivos en Ecuador',
  slogan: 'Excelencia Deportiva',
  tagline: 'Implementos deportivos de calidad profesional.',
  description:
    'Balones de fútbol, futsal y vóley de calidad profesional. Tienda en Guayaquil con envíos a todo Ecuador.',
  url: 'https://siemprepawer.com',
  email: 'siemprepawer@gmail.com',
  // Solo dígitos con código de país.
  whatsapp: '593983784840',
  whatsappDisplay: '+593 98 378 4840',
  city: 'Urdesa, Guayaquil',
  social: {
    instagram: 'https://www.instagram.com/siemprepawer.ec/',
    facebook: 'https://www.facebook.com/Siemprepawer.ec',
    tiktok: 'https://www.tiktok.com/@siemprepawer',
  },
  nav: [
    { label: 'Inicio', to: '/' },
    { label: 'Tienda', to: '/tienda' },
    { label: 'Cotiza para tu colegio', to: '/cotizar' },
    { label: 'Distribuidores', to: '/distribuidores' },
    { label: 'Rastrear pedido', to: '/rastrear' },
  ],
  hero: {
    eyebrow: 'Implementos deportivos',
    title: 'Todo para tu juego',
    text: 'Balones, platillos, vallas y escaleras de agilidad. Envíos a todo Ecuador.',
    cta: 'Explorar tienda',
    ctaSecondary: 'Cotiza para tu colegio',
  },
  searchPlaceholder: 'Busca balones, conos y más',
  benefits: [
    { icon: 'fa-solid fa-mobile-screen-button', title: 'Compra en línea', text: 'Arma tu pedido desde el celular.' },
    { icon: 'fa-solid fa-credit-card', title: 'Pago con PayPhone', text: 'Tarjeta, transferencia o contra entrega.' },
    { icon: 'fa-solid fa-truck-fast', title: 'Envíos por Servientrega', text: 'A todo Ecuador, o retira en Urdesa.' },
    { icon: 'fa-solid fa-clipboard-list', title: 'Cotiza para tu colegio', text: 'Sube tu lista y te enviamos el precio.', to: '/cotizar' },
  ],
  // Icono del carrusel de categorías cuando la categoría no tiene imagen.
  categoryIcons: {
    futbol: 'fa-solid fa-futbol',
    futsal: 'fa-solid fa-futbol',
    indoor: 'fa-solid fa-futbol',
    voley: 'fa-solid fa-volleyball',
    ecuavoley: 'fa-solid fa-volleyball',
    basket: 'fa-solid fa-basketball',
    implementos: 'fa-solid fa-stopwatch',
    rehab: 'fa-solid fa-kit-medical',
    uniformes: 'fa-solid fa-shirt',
    bolsos: 'fa-solid fa-bag-shopping',
    publicitarios: 'fa-solid fa-bullhorn',
    escolar: 'fa-solid fa-school',
  } as Record<string, string>,
  home: {
    bestSellers: 'Los más vendidos',
    newest: 'Nuevos en la tienda',
    seeAll: 'Ver todo',
    schoolEyebrow: 'Colegios y clubes',
    schoolTitle: 'Implementos deportivos para colegios y clubes',
    schoolText: 'Todo en un solo proveedor.',
    schoolCta: 'Cotiza tu lista',
    uniformsEyebrow: 'Personalizados',
    uniformsTitle: 'Uniformes para tu equipo',
    uniformsCta: 'Ver uniformes',
  },
  added: {
    title: 'Agregado al carrito',
    keepShopping: 'Seguir comprando',
    goCart: 'Ver carrito',
    crossSell: 'Completa tu juego',
  },
  quote: {
    title: 'Cotiza para tu colegio',
    intro: 'Elige productos y cantidades para tu institución.',
    tabBuild: 'Armar mi lista',
    tabUpload: 'Adjuntar mi lista',
    searchPlaceholder: 'Buscar balones, conos, chalecos…',
    addCustom: 'Agregar otro producto',
    customPlaceholder: 'Producto que no está en la tienda',
    uploadHint: 'PDF, Excel, Word o una foto de tu lista (máx. 10 MB).',
    uploadCta: 'Elegir archivo',
    emptyList: 'Busca productos y agrégalos a tu lista.',
    fields: {
      institution: 'Nombre del colegio o club',
      name: 'Tu nombre',
      email: 'Correo',
      phone: 'Teléfono / WhatsApp',
      city: 'Ciudad de entrega',
      notes: 'Observaciones (tallas, colores, fechas)',
    },
    submit: 'Solicitar cotización',
    footnote: 'Te enviamos la cotización por correo o WhatsApp. Esta solicitud no genera ningún cobro.',
    successTitle: 'Recibimos tu solicitud',
    successText: 'Te escribimos con la cotización lo antes posible.',
    successCta: 'Seguir viendo la tienda',
  },
  wholesale: {
    title: 'Academias, escuelas y clubes',
    text: 'Mientras más unidades llevas, menor es el precio por balón. Si eres distribuidor, pide tu acceso y compra con precios exclusivos.',
    cta: 'Quiero ser distribuidor',
  },
  paymentLabels: {
    card: 'Tarjeta de crédito o débito',
    transfer: 'Transferencia bancaria',
    cod: 'Pago contra entrega',
  },
  paymentHints: {
    card: 'El mejor precio. Pago seguro con Payphone.',
    transfer: 'Confirmamos tu pedido al recibir el comprobante.',
    cod: 'Pagas al recibir. Aplica un recargo por gestión.',
  },
  statusLabels: {
    pending_payment: 'Pendiente de pago',
    paid: 'Pagado',
    preparing: 'En preparación',
    shipped: 'Enviado',
    delivered: 'Entregado',
    cancelled: 'Cancelado',
  },
  provinces: [
    'Azuay', 'Bolívar', 'Cañar', 'Carchi', 'Chimborazo', 'Cotopaxi', 'El Oro', 'Esmeraldas',
    'Galápagos', 'Guayas', 'Imbabura', 'Loja', 'Los Ríos', 'Manabí', 'Morona Santiago', 'Napo',
    'Orellana', 'Pastaza', 'Pichincha', 'Santa Elena', 'Santo Domingo de los Tsáchilas',
    'Sucumbíos', 'Tungurahua', 'Zamora Chinchipe',
  ],
  analytics: {
    metaPixelId: import.meta.env.VITE_META_PIXEL_ID || '',
    gaId: import.meta.env.VITE_GA_ID || '',
    tiktokPixelId: import.meta.env.VITE_TIKTOK_PIXEL_ID || '',
  },
} as const

export function whatsappLink(message = 'Hola, quiero más información'): string {
  if (!site.whatsapp) return '#'
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`
}
