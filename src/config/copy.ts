/**
 * Textos de la tienda que no estaban en site.ts. Mismo criterio: el copy es
 * configuración y los componentes solo lo pintan.
 */
export const copy = {
  marquee: ['Siempre Pawer', 'Excelencia Deportiva', 'Envíos a todo Ecuador', 'Retiro en Urdesa'],
  home: {
    categoriesEyebrow: 'Elige tu cancha',
    categoriesTitle: 'Compra por deporte',
    featuredEyebrow: 'Lo más pedido',
    featuredTitle: 'Balones destacados',
    featuredCta: 'Ver todo el catálogo',
    heroBadge: 'Calidad profesional',
  },
  shop: {
    eyebrow: 'Catálogo',
    title: 'Tienda',
    all: 'Todo',
    searchLabel: 'Buscar productos',
    searchPlaceholder: 'Buscar balón, talla, marca',
    resultsFor: 'Resultados para',
    sortLabel: 'Ordenar',
    sort: [
      { value: 'newest', label: 'Más nuevos' },
      { value: 'price_asc', label: 'Menor precio' },
      { value: 'price_desc', label: 'Mayor precio' },
    ],
    loadMore: 'Ver más productos',
    empty: 'No encontramos productos con ese filtro.',
    emptyCta: 'Ver todo el catálogo',
  },
  product: {
    cardLabel: 'con tarjeta',
    fromLabel: {
      card: 'con tarjeta',
      transfer: 'con transferencia',
      cod: 'contra entrega',
    },
    soldOut: 'Agotado',
    lowStock: 'Últimas unidades',
    inStock: 'En stock',
    priceCard: 'Tarjeta',
    priceTransfer: 'Transferencia',
    priceCod: 'Contra entrega',
    bestPrice: 'Mejor precio',
    distributorLabel: 'Tu precio de distribuidor',
    tiersTitle: 'Precio por volumen',
    tierLine: (min: number, price: string) => `Llevando ${min}+ unidades: ${price} c/u`,
    qtyLabel: 'Cantidad',
    add: 'Agregar al carrito',
    added: 'Agregado al carrito',
    whatsapp: 'Preguntar por WhatsApp',
    whatsappMessage: (name: string, url: string) => `Hola, me interesa el producto ${name}: ${url}`,
    features: 'Características',
    specs: 'Ficha técnica',
    description: 'Descripción',
    related: 'También te puede servir',
    notFound: 'Este producto no existe o ya no está disponible.',
  },
  cart: {
    title: 'Tu carrito',
    empty: 'Tu carrito está vacío.',
    emptyCta: 'Ir a la tienda',
    methodTitle: 'Precio según cómo pagas',
    methodHint: 'Los precios cambian según el método de pago. Puedes cambiarlo en el checkout.',
    subtotal: 'Subtotal estimado',
    shippingNote: 'El envío y los cupones se calculan en el siguiente paso.',
    checkout: 'Finalizar compra',
    continue: 'Seguir comprando',
    remove: 'Quitar',
    each: 'c/u',
  },
  checkout: {
    title: 'Finalizar compra',
    guestNote: 'No necesitas crear una cuenta. Te enviamos el estado del pedido a tu correo.',
    customer: 'Tus datos',
    firstName: 'Nombre',
    lastName: 'Apellido',
    email: 'Correo',
    phone: 'Celular',
    documentId: 'Cédula o RUC',
    delivery: 'Entrega',
    deliveryHome: 'Envío a domicilio',
    deliveryHomeHint: 'Por Servientrega a todo Ecuador',
    pickup: 'Retiro en tienda',
    pickupHint: 'Gratis en Urdesa, Guayaquil',
    receiverName: 'Quién recibe',
    receiverPhone: 'Celular de quien recibe',
    province: 'Provincia',
    city: 'Ciudad',
    address: 'Dirección',
    reference: 'Referencia',
    referencePlaceholder: 'Color de la casa, local, punto de referencia',
    invoiceToggle: 'Necesito factura con mis datos',
    invoiceName: 'Razón social o nombre',
    invoiceDocument: 'Cédula o RUC',
    invoiceEmail: 'Correo para la factura',
    invoiceAddress: 'Dirección de facturación',
    coupon: 'Cupón de descuento',
    couponPlaceholder: 'Código de cupón',
    couponApply: 'Aplicar',
    couponRemove: 'Quitar cupón',
    couponApplied: (code: string, pct: number) => `Cupón ${code} aplicado: ${pct}% de descuento`,
    payment: 'Método de pago',
    distributorNote: 'Como distribuidor pagas por transferencia con tus precios exclusivos.',
    summary: 'Resumen',
    subtotal: 'Subtotal',
    discount: 'Descuento',
    shipping: 'Envío',
    free: 'Gratis',
    total: 'Total',
    quoteError: 'No pudimos calcular el total. Revisa tu conexión e inténtalo de nuevo.',
    submit: {
      card: 'Continuar al pago',
      transfer: 'Confirmar pedido',
      cod: 'Confirmar pedido',
    },
    submitting: 'Creando tu pedido',
    terms: 'Al confirmar aceptas los términos y la política de envíos.',
    emptyCart: 'No hay productos en tu carrito.',
    payTitle: 'Paga con tarjeta',
    payText: 'Ingresa los datos de tu tarjeta en el formulario seguro de Payphone. El formulario vence en 10 minutos.',
    payLoading: 'Cargando el formulario de pago',
    payError: 'No se pudo cargar el formulario de pago.',
    payRetry: 'Reintentar',
    payBack: 'Cambiar método de pago',
  },
  payment: {
    confirming: 'Confirmando tu pago',
    confirmingText: 'No cierres esta página, toma solo unos segundos.',
    approved: 'Pago aprobado',
    approvedText: 'Recibimos tu pago. Te enviamos la confirmación a tu correo.',
    rejected: 'El pago no se completó',
    rejectedText: 'No se realizó ningún cobro. Puedes intentarlo de nuevo o elegir otro método de pago.',
    missing: 'No encontramos los datos del pago en el enlace.',
    viewOrder: 'Ver mi pedido',
    retry: 'Volver al checkout',
  },
  order: {
    eyebrow: 'Pedido',
    created: {
      cod: 'Pedido confirmado. Pagas al recibirlo. Te avisamos por correo cuando salga.',
      transfer: 'Pedido registrado. Transfiere el total y sube tu comprobante para que lo preparemos.',
      card: 'Pedido registrado.',
    },
    timeline: 'Estado',
    items: 'Productos',
    totals: 'Totales',
    delivery: 'Entrega',
    pickupAt: 'Retiro en',
    tracking: 'Guía de Servientrega',
    trackingCta: 'Rastrear envío',
    bankTitle: 'Cuentas para transferir',
    bankHint: 'Usa tu número de pedido como referencia de la transferencia.',
    bankEmpty: 'Escríbenos por WhatsApp y te enviamos los datos bancarios.',
    receiptTitle: 'Sube tu comprobante',
    receiptHint: 'Foto o PDF de la transferencia.',
    receiptPick: 'Elegir archivo',
    receiptSend: 'Enviar comprobante',
    receiptSent: 'Comprobante recibido. Lo revisamos y te avisamos por correo.',
    receiptView: 'Ver comprobante enviado',
    cancelled: 'Este pedido fue cancelado. Si tienes dudas, escríbenos.',
    help: 'Tengo una pregunta sobre mi pedido',
    emailPrompt: 'Ingresa el correo con el que hiciste el pedido para verlo.',
    notFound: 'No encontramos un pedido con ese número y correo.',
    payMethod: 'Pago',
  },
  track: {
    eyebrow: 'Seguimiento',
    title: 'Rastrea tu pedido',
    text: 'Ingresa el número de pedido (por ejemplo PW-1001) y el correo que usaste al comprar.',
    number: 'Número de pedido',
    email: 'Correo',
    submit: 'Ver estado',
  },
  distributors: {
    eyebrow: 'Ventas al por mayor',
    title: 'Equipa a tu academia, escuela o club',
    text: 'Precios exclusivos para quienes compran en volumen. Te creamos un acceso y desde ahí haces tus pedidos con tu precio de distribuidor.',
    cta: 'Pedir acceso por WhatsApp',
    login: 'Ya tengo acceso',
    whatsappMessage: 'Hola, quiero ser distribuidor de Siempre Pawer. Mi institución es:',
    audiences: [
      { icon: 'fa-solid fa-futbol', title: 'Academias', text: 'Balones de entrenamiento para todas las categorías, del N3 al N5.' },
      { icon: 'fa-solid fa-school', title: 'Escuelas y colegios', text: 'Combos escolares para educación física y campeonatos internos.' },
      { icon: 'fa-solid fa-people-group', title: 'Clubes y ligas', text: 'Reposición de balones para la temporada con precio por volumen.' },
    ],
    stepsTitle: 'Cómo funciona',
    steps: [
      { title: 'Escríbenos', text: 'Cuéntanos quién eres y qué necesitas por WhatsApp.' },
      { title: 'Recibe tu acceso', text: 'Creamos tu usuario de distribuidor con tus precios.' },
      { title: 'Pide en línea', text: 'Ingresas, armas tu pedido y pagas por transferencia.' },
    ],
  },
  login: {
    eyebrow: 'Acceso',
    title: 'Ingresar',
    text: 'Para distribuidores y administración. Para comprar no necesitas cuenta.',
    email: 'Correo',
    password: 'Contraseña',
    submit: 'Ingresar',
    loading: 'Ingresando',
    noAccount: '¿Quieres ser distribuidor?',
    noAccountCta: 'Pide tu acceso',
  },
  account: {
    eyebrow: 'Mi cuenta',
    distributorNotice: 'Estás viendo precios de distribuidor en toda la tienda. Tus pedidos se pagan por transferencia.',
    adminNotice: 'Tienes acceso al panel de administración.',
    adminCta: 'Ir al panel',
    shopCta: 'Ir a la tienda',
    logout: 'Cerrar sesión',
    fields: { name: 'Nombre', email: 'Correo', phone: 'Teléfono', company: 'Empresa' },
  },
  notFound: {
    code: '404',
    title: 'Fuera de juego',
    text: 'La página que buscas no existe o cambió de lugar.',
    cta: 'Volver al inicio',
  },
  states: {
    loading: 'Cargando',
    error: 'No pudimos conectar con la tienda. Inténtalo de nuevo en un momento.',
    retry: 'Reintentar',
  },
  footer: {
    shop: 'Tienda',
    help: 'Ayuda',
    policies: 'Políticas',
    follow: 'Síguenos',
    login: 'Acceso distribuidores',
  },
}

export interface PolicySection {
  heading: string
  body: string[]
}

export interface Policy {
  title: string
  intro: string
  sections: PolicySection[]
}

// BORRADORES para revisar con el cliente: sin plazos ni montos inventados.
export const policies: Record<string, Policy> = {
  envios: {
    title: 'Política de envíos',
    intro: 'Enviamos a todo Ecuador desde Guayaquil a través de Servientrega.',
    sections: [
      {
        heading: 'Cobertura',
        body: [
          'Realizamos envíos a las 24 provincias del Ecuador mediante Servientrega. Algunas zonas rurales o de difícil acceso pueden requerir más tiempo de entrega o retiro en la oficina de Servientrega más cercana.',
        ],
      },
      {
        heading: 'Costo del envío',
        body: [
          'El costo del envío se muestra en el checkout antes de confirmar tu pedido. Cuando la tienda tiene una promoción de envío gratis por monto mínimo, el descuento se aplica automáticamente en el resumen.',
          'El retiro en nuestro punto de Urdesa, Guayaquil, no tiene costo.',
        ],
      },
      {
        heading: 'Tiempos de entrega',
        body: [
          'Despachamos tu pedido una vez confirmado el pago (o de inmediato en pedidos contra entrega). El tiempo de entrega depende del destino y de los tiempos vigentes de Servientrega.',
          'Cuando tu pedido salga, te enviamos por correo el número de guía para que puedas rastrearlo.',
        ],
      },
      {
        heading: 'Recepción del pedido',
        body: [
          'Revisa el paquete al recibirlo. Si notas daños visibles en el empaque, déjalo anotado con el mensajero y escríbenos por WhatsApp con fotos el mismo día.',
        ],
      },
    ],
  },
  devoluciones: {
    title: 'Cambios y devoluciones',
    intro: 'Queremos que juegues con el producto que elegiste. Si algo no está bien, te ayudamos.',
    sections: [
      {
        heading: 'Productos con defecto de fábrica',
        body: [
          'Si recibes un producto con defecto de fábrica, escríbenos por WhatsApp o correo con tu número de pedido y fotos o video del problema. Revisamos el caso y coordinamos el cambio del producto.',
        ],
      },
      {
        heading: 'Cambios por otro producto',
        body: [
          'Puedes solicitar un cambio por otro producto o talla siempre que el artículo esté sin uso y en su empaque original. Los costos de envío asociados al cambio se informan al momento de coordinarlo.',
        ],
      },
      {
        heading: 'Desgaste por uso',
        body: [
          'El desgaste normal por uso, golpes contra superficies no aptas o uso distinto al indicado no se considera defecto de fábrica.',
        ],
      },
      {
        heading: 'Reembolsos',
        body: [
          'Cuando corresponda un reembolso, se realiza por el mismo medio de pago utilizado. Los tiempos de acreditación dependen de la entidad bancaria o de Payphone.',
          'Este procedimiento no limita los derechos que te reconoce la Ley Orgánica de Defensa del Consumidor.',
        ],
      },
    ],
  },
  privacidad: {
    title: 'Política de privacidad',
    intro: 'Cuidamos tus datos y los usamos solo para procesar y entregar tus pedidos.',
    sections: [
      {
        heading: 'Qué datos recopilamos',
        body: [
          'Nombre, correo, teléfono, cédula o RUC, dirección de entrega y, si la solicitas, los datos de facturación. No almacenamos los datos de tu tarjeta: el pago con tarjeta lo procesa Payphone.',
        ],
      },
      {
        heading: 'Para qué los usamos',
        body: [
          'Para procesar tu pedido, coordinar la entrega con Servientrega, emitir tu factura, enviarte avisos sobre el estado del pedido y atender tus consultas.',
          'Usamos herramientas de medición (por ejemplo Meta, Google y TikTok) para entender cómo se usa la tienda y mejorar nuestras campañas.',
        ],
      },
      {
        heading: 'Con quién los compartimos',
        body: [
          'Solo con los proveedores necesarios para completar tu compra: la empresa de envíos, la pasarela de pagos y los servicios que usamos para enviarte correos. No vendemos tus datos.',
        ],
      },
      {
        heading: 'Tus derechos',
        body: [
          'Puedes pedirnos acceder, corregir o eliminar tus datos escribiendo a nuestro correo de contacto, conforme a la Ley Orgánica de Protección de Datos Personales del Ecuador.',
        ],
      },
    ],
  },
  terminos: {
    title: 'Términos y condiciones',
    intro: 'Estas condiciones aplican a las compras realizadas en la tienda en línea de Siempre Pawer.',
    sections: [
      {
        heading: 'Precios',
        body: [
          'Los precios se muestran en dólares de los Estados Unidos y varían según el método de pago elegido: tarjeta, transferencia o contra entrega. El total final se muestra en el checkout antes de confirmar.',
          'Los descuentos por volumen y los cupones se aplican automáticamente según las condiciones vigentes. Los cupones no son acumulables con precios de distribuidor.',
        ],
      },
      {
        heading: 'Pedidos y disponibilidad',
        body: [
          'Todo pedido está sujeto a disponibilidad de stock. Si después de confirmar un pedido un producto no estuviera disponible, te contactamos para ofrecerte un cambio o el reembolso.',
        ],
      },
      {
        heading: 'Pagos',
        body: [
          'Los pagos con tarjeta se procesan mediante Payphone. Los pedidos por transferencia se preparan una vez verificado el comprobante. En pedidos contra entrega, el pago se realiza al recibir el producto.',
        ],
      },
      {
        heading: 'Facturación',
        body: [
          'Si necesitas factura con tus datos, márcalo en el checkout. La factura electrónica se emite conforme a la normativa del SRI y se envía al correo indicado.',
        ],
      },
      {
        heading: 'Contacto',
        body: [
          'Para cualquier consulta sobre tu compra, escríbenos por WhatsApp o a nuestro correo. Atendemos desde Urdesa, Guayaquil.',
        ],
      },
    ],
  },
}

export const policyLinks = [
  { slug: 'envios', label: 'Envíos' },
  { slug: 'devoluciones', label: 'Cambios y devoluciones' },
  { slug: 'privacidad', label: 'Privacidad' },
  { slug: 'terminos', label: 'Términos y condiciones' },
]
