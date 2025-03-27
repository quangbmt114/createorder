import { CartItemType, PromotionTypeEnum } from "@/types/order";

export const calculateItemPrice = (item: CartItemType): number => {
  if (!item.promotion || item.promotion.code === "NONE") {
    return item.price * item.quantity;
  }

  if (item.promotion.type === PromotionTypeEnum.PERCENTAGE) {
    return item.price * item.quantity * (1 - item.promotion.value / 100);
  }

  if (item.promotion.type === PromotionTypeEnum.FIXED) {
    return Math.max(0, item.price * item.quantity - item.promotion.value);
  }

  return item.price * item.quantity;
};
