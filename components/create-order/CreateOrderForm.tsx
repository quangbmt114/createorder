"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { FaShoppingCart } from "react-icons/fa";
import { Typography, message } from "antd";

import { CustomerForm } from "./CustomerForm";
import { ProductsSection } from "./ProductsSection";
import { PaymentSection } from "./PaymentSection";
import { OrderSummary } from "./OrderSummary";
import { ConfirmOrderModal } from "./ConfirmOrderModal";
import {
  type CartItemType,
  PaymentMethodEnum,
  PromotionTypeEnum,
  type OrderFormData,
  type OrderDetails,
} from "@/types/order";
import { COLORS, PRODUCTS, PROMOTIONS } from "@/constants/order";

const { Title } = Typography;

const schema = yup.object().shape({
  customerName: yup.string().required("Customer name is required"),
  customerEmail: yup
    .string()
    .email("Invalid email format")
    .required("Customer email is required"),
  customerPhone: yup
    .string()
    .matches(/^[0-9]{10}$/, "Phone number must be 10 digits")
    .required("Customer phone is required"),
  paymentMethod: yup.string().required("Payment method is required"),
  cashAmount: yup.number().when("paymentMethod", {
    is: PaymentMethodEnum.CASH,
    then: (schema) =>
      schema
        .min(0, "Cash amount must be positive")
        .required("Cash amount is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
});

export default function CreateOrderForm() {
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<OrderFormData>({
    resolver: yupResolver(schema) as any,
    defaultValues: {
      customerName: "",
      customerEmail: "",
      customerPhone: "",
      paymentMethod: PaymentMethodEnum.CASH,
      cashAmount: 0,
    },
  });

  const paymentMethod = watch("paymentMethod");
  const cashAmount = watch("cashAmount") || 0;

  const [cart, setCart] = useState<CartItemType[]>([]);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [messageApi, contextHolder] = message.useMessage();

  const totalAmount = useMemo(() => {
    return cart.reduce((total, item) => total + calculateItemPrice(item), 0);
  }, [cart]);

  const changeAmount = useMemo(() => {
    return paymentMethod === PaymentMethodEnum.CASH
      ? cashAmount - totalAmount
      : 0;
  }, [paymentMethod, cashAmount, totalAmount]);

  const isCashSufficient = useMemo(() => {
    return (
      paymentMethod !== PaymentMethodEnum.CASH || cashAmount >= totalAmount
    );
  }, [paymentMethod, cashAmount, totalAmount]);

  const addToCart = (productId: number): void => {
    const product = PRODUCTS.find((p) => p.id === productId);
    if (product) {
      const existingItem = cart.find((item) => item.id === productId);

      if (existingItem) {
        setCart(
          cart.map((item) =>
            item.id === productId
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        );
        messageApi.success(
          `Increased ${product.name} quantity to ${existingItem.quantity + 1}`
        );
      } else {
        setCart([
          ...cart,
          {
            ...product,
            quantity: 1,
            promotion: PROMOTIONS[4],
          },
        ]);
        messageApi.success(`Added ${product.name} to cart`);
      }
    }
  };

  const removeFromCart = (productId: number): void => {
    const product = cart.find((item) => item.id === productId);
    if (product) {
      setCart(cart.filter((item) => item.id !== productId));
      messageApi.warning(`Removed ${product.name} from cart`);
    }
  };

  const updateQuantity = (productId: number, quantity: number): void => {
    if (quantity > 0) {
      setCart(
        cart.map((item) =>
          item.id === productId ? { ...item, quantity } : item
        )
      );
      const product = cart.find((item) => item.id === productId);
      if (product) {
        messageApi.info(`Updated ${product.name} quantity to ${quantity}`);
      }
    }
  };

  const updatePrice = (productId: number, price: number): void => {
    if (price > 0) {
      setCart(
        cart.map((item) => (item.id === productId ? { ...item, price } : item))
      );
      const product = cart.find((item) => item.id === productId);
      if (product) {
        messageApi.info(`Updated ${product.name} price to $${price}`);
      }
    }
  };

  const updatePromotion = (productId: number, promotionId: number): void => {
    const promotion = PROMOTIONS.find((p) => p.id === promotionId);
    if (promotion) {
      setCart(
        cart.map((item) =>
          item.id === productId ? { ...item, promotion } : item
        )
      );
      const product = cart.find((item) => item.id === productId);
      if (product) {
        messageApi.info(`Applied ${promotion.description} to ${product.name}`);
      }
    }
  };

  const onSubmit = (data: OrderFormData): void => {
    if (paymentMethod === PaymentMethodEnum.CASH && cashAmount < totalAmount) {
      messageApi.error("Cash amount is insufficient for payment");
      return;
    }

    const orderData: OrderDetails = {
      ...data,
      cart,
      totalAmount,
      changeAmount:
        data.paymentMethod === PaymentMethodEnum.CASH ? changeAmount : 0,
    };

    setOrderDetails(orderData);
    setIsModalVisible(true);
  };

  return (
    <>
      {contextHolder}
      <Title level={2} style={{ color: COLORS.primary }}>
        <FaShoppingCart style={{ marginRight: "8px" }} /> Create Order
      </Title>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full overflow-x-hidden"
      >
        <div className="flex flex-col md:flex-row gap-5">
          <div className="w-full md:w-3/5">
            <CustomerForm control={control} errors={errors} />
            <ProductsSection
              cart={cart}
              addToCart={addToCart}
              updateQuantity={updateQuantity}
              updatePrice={updatePrice}
              updatePromotion={updatePromotion}
              removeFromCart={removeFromCart}
              calculateItemPrice={calculateItemPrice}
            />
          </div>

          <div className="w-full md:w-2/5">
            <PaymentSection
              control={control}
              errors={errors}
              paymentMethod={paymentMethod}
            />
            <OrderSummary
              cart={cart}
              totalAmount={totalAmount}
              paymentMethod={paymentMethod}
              cashAmount={cashAmount}
              changeAmount={changeAmount}
              isCashSufficient={isCashSufficient}
            />
          </div>
        </div>
      </form>

      <ConfirmOrderModal
        isVisible={isModalVisible}
        orderDetails={orderDetails}
        onClose={() => setIsModalVisible(false)}
        onComplete={() => {
          setIsModalVisible(false);
          reset();
          setCart([]);
          messageApi.success("Order completed successfully!");
        }}
      />
    </>
  );
}

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
