export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
  path: string;
}

export interface PaginatedResponse<T = unknown> extends ApiResponse<T[]> {
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface ApiError {
  success: false;
  message: string;
  error: string;
  details: unknown;
  timestamp: string;
  path: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface RegisterDTO {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface ResetPasswordDTO {
  email: string;
  token: string;
  newPassword: string;
}

export interface AddCartItemDTO {
  menuItemId: string;
  quantity: number;
  variants?: {
    groupName: string;
    selectedOption: string;
    additionalPrice: number;
  }[];
  notes?: string;
  cartId?: string; // For guest users
}

export interface CreateOrderDTO {
  deliveryType: "delivery" | "collection";
  deliveryAddress?: {
    street: string;
    street2?: string;
    zipCode: string;
    state?: string;
    city?: string;
    country: string;
    latitude?: number;
    longitude?: number;
  };
  guestEmail?: string;
  guestPhone?: string;
  guestName?: string;
  specialInstructions?: string;
  paymentMethod: "cash" | "stripe";
  userId?: string;
  cartId?: string;
}

export interface MenuQueryParams {
  category?: string;
  search?: string;
  dietary?: string;
  page?: number;
  limit?: number;
  featured?: boolean;
  isCatering?: boolean;
}

export interface UpdateProfileDTO {
  firstName?: string;
  lastName?: string;
  phone?: string;
  profilePhoto?: string;
}

export interface AddressDTO {
  label: string;
  street: string;
  street2?: string;
  zipCode: string;
  city?: string;
  state?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  isDefault?: boolean;
}

export interface CreateReviewDTO {
  orderId: string;
  menuItemId?: string;
  rating: number;
  comment: string;
  images?: string[];
}

export interface InitPaymentDTO {
  orderId: string;
  amount: number;
  email: string;
  paymentMethod: "cash" | "stripe";
}

export interface NotificationPrefsDTO {
  email: {
    orderConfirmation: boolean;
    orderStatus: boolean;
    promotions: boolean;
    reviews: boolean;
  };
  sms: boolean;
  push: boolean;
  inApp: {
    orderConfirmation: boolean;
    orderStatus: boolean;
    promotions: boolean;
    reviews: boolean;
  };
}

export interface DeliveryValidationResponse {
  available: boolean;
  zoneId?: string;
  zoneName?: string;
  deliveryFee?: number;
  minimumOrder?: number;
  estimatedDeliveryTimeMin?: number;
  estimatedDeliveryTimeMax?: number;
}
export interface checkDeliveryParams {
  zipCode?: string;
  latitude?: number;
  longitude?: number;
}
export interface LocationData {
  zipCode: string;
  zoneName?: string;
  latitude?: number;
  longitude?: number;
  isValidated: boolean;
  deliveryInfo?: DeliveryValidationResponse;
  selectedAddressId?: string;
  selectedAddress?: AddressDTO;
  method: "delivery" | "collection";
}

export interface DeliveryZone {
  _id: string;
  name: string;
  deliveryFee: number;
  minimumOrder: number;
  estimatedDeliveryTimeMin: number;
  estimatedDeliveryTimeMax: number;
  active: boolean;
}

// ── DELIVERY ADDRESS FOR ORDERS ────────────────────────────────────────────
export interface DeliveryAddress {
  street: string;
  street2?: string;
  zipCode: string;
  city?: string;
  state?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
}
