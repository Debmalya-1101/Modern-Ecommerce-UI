export const API_ENDPOINTS = {
  auth: {
    login: '/auth/login',
    signup: '/auth/signup',
    me: '/auth/me',
    refresh: '/auth/refresh',
    logout: '/auth/logout'
  },
  products: {
    list: '/api/products',
    detail: (id: number | string) => `/api/products/${id}`,
    categories: '/api/products/categories',
    brands: '/api/products/brands'
  },
  cart: {
    root: '/api/cart',
    add: '/api/cart/add',
    item: (itemId: number | string) => `/api/cart/item/${itemId}`,
    clear: '/api/cart/clear'
  },
  wishlist: {
    root: '/api/wishlist',
    add: '/api/wishlist/add',
    item: (itemId: number | string) => `/api/wishlist/item/${itemId}`,
    toggle: (productId: number | string) => `/api/wishlist/toggle/${productId}`
  },
  orders: {
    root: '/api/orders',
    checkout: '/api/orders/checkout',
    detail: (orderId: number | string) => `/api/orders/${orderId}`,
    deliveryFeedback: (orderId: number | string) => `/api/orders/${orderId}/delivery-feedback`,
    deliveryFeedbackStatus: (orderId: number | string) => `/api/delivery-feedback/order/${orderId}`
  },
  payments: {
    initiate: (orderId: number | string) => `/api/payments/initiate/${orderId}`,
    confirm: '/api/payments/confirm',
    retry: '/api/payments/retry'
  },
  addresses: {
    root: '/api/addresses',
    detail: (id: number | string) => `/api/addresses/${id}`,
    default: (id: number | string) => `/api/addresses/${id}/default`
  },
  reviews: {
    root: '/api/reviews',
    detail: (reviewId: number | string) => `/api/reviews/${reviewId}`,
    product: (productId: number | string) => `/api/reviews/product/${productId}`
  },
  admin: {
    products: '/api/admin/products',
    productDetail: (productId: number | string) => `/api/admin/products/${productId}`,
    productStock: (productId: number | string) => `/api/admin/products/${productId}/stock`,
    productStatus: (productId: number | string) => `/api/admin/products/${productId}/status`,
    orders: '/api/admin/orders',
    orderDetail: (orderId: number | string) => `/api/admin/orders/${orderId}`,
    orderStatus: (orderId: number | string) => `/api/admin/orders/${orderId}/status`,
    analyticsDashboard: '/api/admin/analytics/dashboard',
    categories: '/api/admin/categories',
    categoryDetail: (categoryId: number | string) => `/api/admin/categories/${categoryId}`,
    attributeKeys: '/api/admin/attribute-keys',
    attributeKeyDetail: (keyId: number | string) => `/api/admin/attribute-keys/${keyId}`,
    scraperAmazon: '/api/admin/scraper/amazon',
    scraperFlipkart: '/api/admin/scraper/flipkart',
    users: {
      root: '/api/admin/users',
      detail: (id: number | string) => `/api/admin/users/${id}`,
      role: (id: number | string) => `/api/admin/users/${id}/roles`,
      status: (id: number | string) => `/api/admin/users/${id}/status`
    }
  },
  oauth2: {
    google: '/oauth2/authorization/google',
    facebook: '/oauth2/authorization/facebook'
  },
  deliveryPartner: {
    auth: {
      signup: '/auth/delivery-partner/signup'
    },
    shipments: {
      dashboard: '/api/delivery-partner/shipments/dashboard',
      active: '/api/delivery-partner/shipments/active',
      history: '/api/delivery-partner/shipments/history',
      detail: (id: number | string) => `/api/delivery-partner/shipments/${id}`,
      status: (id: number | string) => `/api/delivery-partner/shipments/${id}/status`
    },
    feedback: {
      root: '/api/delivery-partner/feedback',
      summary: '/api/delivery-partner/feedback/summary'
    }
  },
  adminDelivery: {
    partners: {
      root: '/api/admin/delivery-partners',
      detail: (id: number | string) => `/api/admin/delivery-partners/${id}`,
      status: (id: number | string) => `/api/admin/delivery-partners/${id}/status`,
      feedback: (id: number | string) => `/api/admin/delivery-partners/${id}/feedback`,
      ratings: '/api/admin/delivery-partners/ratings'
    },
    shipments: {
      unassigned: '/api/admin/shipments/unassigned',
      assign: (shipmentId: number | string, partnerId: number | string) => `/api/admin/shipments/${shipmentId}/assign/${partnerId}`
    }
  }
} as const;
