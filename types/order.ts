// Enums for constant values
export enum PaymentMethodEnum {
  CASH = "cash",
  CARD = "card",
}

export enum PromotionTypeEnum {
  PERCENTAGE = "percentage",
  FIXED = "fixed",
  NONE = "none",
}

export interface ProductType {
  id: number;
  name: string;
  price: number;
}

export interface PromotionType {
  id: number;
  code: string;
  type: PromotionTypeEnum;
  value: number;
  description: string;
}

export interface CartItemType extends ProductType {
  quantity: number;
  promotion: PromotionType;
}

export interface OrderFormData {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  paymentMethod: PaymentMethodEnum;
  cashAmount?: number;
}

export interface OrderDetails extends OrderFormData {
  cart: CartItemType[];
  totalAmount: number;
  changeAmount: number;
}
