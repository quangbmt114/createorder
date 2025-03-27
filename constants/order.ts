import {
  type ProductType,
  type PromotionType,
  PromotionTypeEnum,
} from "@/types/order";

export const COLORS = {
  primary: "#5c6ac4",
  primaryHover: "#4a58b0",
  success: "#36B37E",
  warning: "#FFAB00",
  error: "#FF5630",
  info: "#00B8D9",
};

export const PRODUCTS: ProductType[] = [
  { id: 1, name: "Laptop", price: 1200 },
  { id: 2, name: "Smartphone", price: 800 },
  { id: 3, name: "Headphones", price: 150 },
  { id: 4, name: "Monitor", price: 300 },
  { id: 5, name: "Keyboard", price: 80 },
];

export const PROMOTIONS: PromotionType[] = [
  {
    id: 1,
    code: "SAVE10",
    type: PromotionTypeEnum.PERCENTAGE,
    value: 10,
    description: "10% off",
  },
  {
    id: 2,
    code: "SAVE20",
    type: PromotionTypeEnum.PERCENTAGE,
    value: 20,
    description: "20% off",
  },
  {
    id: 3,
    code: "FLAT50",
    type: PromotionTypeEnum.FIXED,
    value: 50,
    description: "$50 off",
  },
  {
    id: 4,
    code: "FLAT100",
    type: PromotionTypeEnum.FIXED,
    value: 100,
    description: "$100 off",
  },
  {
    id: 5,
    code: "NONE",
    type: PromotionTypeEnum.NONE,
    value: 0,
    description: "No discount",
  },
];
