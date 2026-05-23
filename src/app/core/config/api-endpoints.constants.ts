export const API_ENDPOINTS = {
  auth: {
    login: '/auth/login',
    signup: '/auth/signup',
    me: '/auth/me'
  },
  products: {
    list: '/api/products',
    detail: (id: number | string) => `/api/products/${id}`
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
    detail: (orderId: number | string) => `/api/orders/${orderId}`
  },
  payments: {
    initiate: (orderId: number | string) => `/api/payments/initiate/${orderId}`,
    confirm: '/api/payments/confirm',
    retry: '/api/payments/retry'
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
    analyticsDashboard: '/api/admin/analytics/dashboard'
  }
} as const;
