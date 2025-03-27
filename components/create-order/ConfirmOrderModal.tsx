import { Modal, Card, Table, Typography } from "antd";
import { COLORS } from "@/constants/order";
import {
  PaymentMethodEnum,
  type OrderDetails,
  type CartItemType,
} from "@/types/order";
import { calculateItemPrice } from "./CreateOrderForm";

const { Title } = Typography;

interface ConfirmOrderModalProps {
  isVisible: boolean;
  orderDetails: OrderDetails | null;
  onClose: () => void;
  onComplete: () => void;
}

export function ConfirmOrderModal({
  isVisible,
  orderDetails,
  onClose,
  onComplete,
}: ConfirmOrderModalProps) {
  const handleOk = (): void => {
    onComplete();
    onClose();
  };

  const handleCancel = (): void => {
    onClose();
  };

  return (
    <Modal
      title="Confirm Order"
      open={isVisible}
      onOk={handleOk}
      onCancel={handleCancel}
      width="95%"
      style={{ maxWidth: "800px" }}
      okButtonProps={{
        className: "custom-primary-button",
        style: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
      }}
    >
      {orderDetails && (
        <div className="overflow-x-hidden">
          <Card title="Customer Information" style={{ marginBottom: 20 }}>
            <p>
              <strong>Name:</strong> {orderDetails.customerName}
            </p>
            <p>
              <strong>Email:</strong> {orderDetails.customerEmail}
            </p>
            <p>
              <strong>Phone:</strong> {orderDetails.customerPhone}
            </p>
          </Card>

          <Card title="Order Items" style={{ marginBottom: 20 }}>
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <Table
                dataSource={orderDetails.cart}
                pagination={false}
                rowKey="id"
                scroll={{ x: "max-content" }}
                columns={[
                  { title: "Product", dataIndex: "name", width: "25%" },
                  {
                    title: "Price",
                    dataIndex: "price",
                    width: "15%",
                    render: (price: number) => `$${price.toFixed(2)}`,
                  },
                  { title: "Quantity", dataIndex: "quantity", width: "15%" },
                  {
                    title: "Promotion",
                    dataIndex: "promotion",
                    width: "25%",
                    render: (promotion) => promotion.description,
                  },
                  {
                    title: "Subtotal",
                    key: "subtotal",
                    width: "20%",
                    render: (_: any, record: CartItemType) =>
                      `$${calculateItemPrice(record).toFixed(2)}`,
                  },
                ]}
              />
            </div>
          </Card>

          <Card title="Payment Details">
            <p>
              <strong>Payment Method:</strong>{" "}
              {orderDetails.paymentMethod === PaymentMethodEnum.CASH
                ? "Cash"
                : "Card"}
            </p>
            {orderDetails.paymentMethod === PaymentMethodEnum.CASH && (
              <>
                <p>
                  <strong>Cash Amount:</strong> $
                  {orderDetails.cashAmount?.toFixed(2)}
                </p>
                <p>
                  <strong>Change:</strong> $
                  {orderDetails.changeAmount.toFixed(2)}
                </p>
              </>
            )}
            <Title level={4} style={{ marginTop: 20 }}>
              Total Amount: ${orderDetails.totalAmount.toFixed(2)}
            </Title>
          </Card>
        </div>
      )}
    </Modal>
  );
}
