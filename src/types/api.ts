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
}

export interface CreateOrderDTO {
  deliveryType: "delivery" | "collection";
  deliveryAddress?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    latitude?: number;
    longitude?: number;
  };
  guestEmail?: string;
  guestPhone?: string;
  guestName?: string;
  specialInstructions?: string;
  paymentMethod: "cash" | "stripe";
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
  city: string;
  state: string;
  zipCode: string;
  country: string;
  latitude?: number;
  longitude?: number;
  isDefault: boolean;
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
  email: boolean;
  sms: boolean;
  push: boolean;
  inApp: boolean;
}
