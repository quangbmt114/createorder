"use client";

import { motion } from "framer-motion";
import { Form, Select, Table, InputNumber, Button, Card, Empty } from "antd";
import { FaTrash } from "react-icons/fa";
import { PRODUCTS, PROMOTIONS, COLORS } from "@/constants/order";
import type { CartItemType } from "@/types/order";

const { Option } = Select;

interface ProductsSectionProps {
  cart: CartItemType[];
  addToCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  updatePrice: (productId: number, price: number) => void;
  updatePromotion: (productId: number, promotionId: number) => void;
  removeFromCart: (productId: number) => void;
  calculateItemPrice: (item: CartItemType) => number;
}

export function ProductsSection({
  cart,
  addToCart,
  updateQuantity,
  updatePrice,
  updatePromotion,
  removeFromCart,
  calculateItemPrice,
}: ProductsSectionProps) {
  const handleQuantityChange = (
    productId: number,
    value: number | null
  ): void => {
    if (value !== null) {
      updateQuantity(productId, value);
    }
  };

  const handlePriceChange = (productId: number, value: number | null): void => {
    if (value !== null) {
      updatePrice(productId, value);
    }
  };

  const handlePromotionChange = (productId: number, value: number): void => {
    updatePromotion(productId, value);
  };

  // Cart columns for the table
  const cartColumns = [
    {
      title: "Product",
      dataIndex: "name",
      key: "name",
      width: "20%",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      width: "20%",
      render: (text: string, record: CartItemType) => (
        <InputNumber
          min={0}
          value={record.price}
          onChange={(value: number | null) =>
            handlePriceChange(record.id, value)
          }
          formatter={(value) =>
            `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          }
          parser={(value: string | undefined) =>
            value ? Number(value.replace(/\$\s?|(,*)/g, "")) : 0
          }
          style={{ width: "100%", minWidth: "80px" }}
        />
      ),
    },
    {
      title: "Qty",
      dataIndex: "quantity",
      key: "quantity",
      width: "15%",
      render: (text: string, record: CartItemType) => (
        <InputNumber
          min={1}
          value={record.quantity}
          onChange={(value: number | null) =>
            handleQuantityChange(record.id, value)
          }
          style={{ width: "100%", minWidth: "60px" }}
        />
      ),
    },
    {
      title: "Promotion",
      key: "promotion",
      width: "20%",
      render: (text: string, record: CartItemType) => (
        <Select
          value={record.promotion.id.toString()}
          style={{ width: "100%", minWidth: "100px" }}
          onChange={(value: string) =>
            handlePromotionChange(record.id, Number.parseInt(value))
          }
        >
          {PROMOTIONS.map((promotion) => (
            <Option key={promotion.id} value={promotion.id.toString()}>
              {promotion.code}
            </Option>
          ))}
        </Select>
      ),
    },
    {
      title: "Subtotal",
      key: "subtotal",
      width: "15%",
      render: (text: string, record: CartItemType) => {
        const subtotal = calculateItemPrice(record);
        return `$${subtotal.toFixed(2)}`;
      },
    },
    {
      title: "",
      key: "action",
      width: "10%",
      render: (text: string, record: CartItemType) => (
        <Button
          type="text"
          style={{ color: COLORS.error }}
          icon={<FaTrash />}
          onClick={() => removeFromCart(record.id)}
        />
      ),
    },
  ];

  return (
    <Card title="Products" style={{ marginBottom: 20 }}>
      <Form.Item label="Add Product">
        <Select
          placeholder="Select a product to add"
          style={{ width: "100%" }}
          onChange={(value: string) => addToCart(Number.parseInt(value))}
          optionLabelProp="label"
        >
          {PRODUCTS.map((product) => (
            <Option
              key={product.id}
              value={product.id.toString()}
              label={`${product.name} - $${product.price}`}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>{product.name}</span>
                <span>${product.price}</span>
              </div>
            </Option>
          ))}
        </Select>
      </Form.Item>

      <div style={{ height: 300, overflow: "auto" }}>
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <Table
            dataSource={cart}
            columns={cartColumns}
            rowKey="id"
            pagination={false}
            scroll={{ x: "max-content", y: 240 }}
            locale={{
              emptyText: (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description="No products in cart"
                />
              ),
            }}
            components={{
              body: {
                row: (props) => {
                  return (
                    <motion.tr
                      {...props}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    />
                  );
                },
              },
            }}
          />
        </div>
      </div>
    </Card>
  );
}
