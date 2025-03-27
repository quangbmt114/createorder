import { CartItemType, PromotionTypeEnum } from "@/types/order";

export const calculateItemPrice = (item: CartItemType): number => {
  const { promotion, price, quantity } = item;

  if (promotion.type === PromotionTypeEnum.PERCENTAGE)
    return price * quantity * (1 - promotion.value / 100);

  if (promotion.type === PromotionTypeEnum.FIXED)
    return Math.max(0, price * quantity - promotion.value);

  return price * quantity;
};
