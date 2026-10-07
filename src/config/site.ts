/**
 * El copy es configuración: todos los textos y datos de la marca viven acá.
 * Los componentes solo consumen y pintan.
 */
export const site = {
  name: 'Siempre Pawer',
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
    { label: 'Distribuidores', to: '/distribuidores' },
    { label: 'Rastrear pedido', to: '/rastrear' },
  ],
  hero: {
    eyebrow: 'Siempre Pawer',
    title: 'Excelencia deportiva en cada toque',
    text: 'Balones termosellados con peso y bote reglamentarios. Para la cancha, el entrenamiento y la academia.',
    cta: 'Ver la tienda',
    ctaSecondary: 'Compras al por mayor',
  },
  benefits: [
    { icon: 'fa-solid fa-truck-fast', title: 'Envíos a todo Ecuador', text: 'Despachamos por Servientrega y te enviamos la guía por correo.' },
    { icon: 'fa-solid fa-store', title: 'Retiro en Urdesa', text: 'Compra en línea y retira gratis en Guayaquil.' },
    { icon: 'fa-solid fa-credit-card', title: 'Paga como prefieras', text: 'Tarjeta, transferencia o contra entrega.' },
    { icon: 'fa-solid fa-medal', title: 'Calidad profesional', text: 'Balones termosellados, resistentes y duraderos.' },
  ],
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
