"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Card, Typography, Tag, Button, Tooltip } from "antd";
import { COLORS } from "@/constants/order";
import { PaymentMethodEnum, type CartItemType } from "@/types/order";
import { FaExclamationTriangle } from "react-icons/fa";

const { Title, Text } = Typography;

interface OrderSummaryProps {
  cart: CartItemType[];
  totalAmount: number;
  paymentMethod: PaymentMethodEnum;
  cashAmount: number;
  changeAmount: number;
  isCashSufficient: boolean;
  calculateItemPrice: (item: CartItemType) => number;
}

export function OrderSummary({
  cart,
  totalAmount,
  paymentMethod,
  cashAmount,
  changeAmount,
  isCashSufficient,
  calculateItemPrice,
}: OrderSummaryProps) {
  const isCheckoutDisabled = useMemo(() => {
    return cart.length === 0 || !isCashSufficient;
  }, [cart.length, isCashSufficient]);

  const totalItems = useMemo(() => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  }, [cart]);

  const tooltipMessage = useMemo(() => {
    if (cart.length === 0) {
      return "Please add at least one product to cart";
    }
    if (!isCashSufficient && paymentMethod === PaymentMethodEnum.CASH) {
      return "Cash amount is insufficient for payment";
    }
    return "";
  }, [cart.length, isCashSufficient, paymentMethod]);

  return (
    <Card>
      <div style={{ textAlign: "center" }}>
        <Title level={3}>Order Summary</Title>
        <div style={{ margin: "20px 0" }}>
          <Text strong>Total Items:</Text> {totalItems}
        </div>
        <div style={{ margin: "20px 0" }}>
          <Title level={4}>Total Amount: ${totalAmount.toFixed(2)}</Title>
        </div>

        {paymentMethod === PaymentMethodEnum.CASH && (
          <div style={{ margin: "20px 0" }}>
            {cashAmount >= totalAmount ? (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                <Tag
                  className="custom-success-tag"
                  style={{ padding: "5px 10px", fontSize: 16 }}
                >
                  Change: ${changeAmount.toFixed(2)}
                </Tag>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                <Tag
                  color="error"
                  style={{ padding: "5px 10px", fontSize: 16 }}
                >
                  <FaExclamationTriangle style={{ marginRight: "5px" }} />
                  Insufficient cash: ${(totalAmount - cashAmount).toFixed(
                    2
                  )}{" "}
                  more needed
                </Tag>
              </motion.div>
            )}
          </div>
        )}

        <Tooltip
          title={tooltipMessage}
          open={isCheckoutDisabled}
          placement="bottom"
        >
          <Button
            type="primary"
            size="large"
            htmlType="submit"
            disabled={isCheckoutDisabled}
            style={{
              marginTop: 20,
              width: "100%",
              backgroundColor: COLORS.primary,
              borderColor: COLORS.primary,
            }}
            className="custom-primary-button"
          >
            Checkout
          </Button>
        </Tooltip>
      </div>
    </Card>
  );
}
