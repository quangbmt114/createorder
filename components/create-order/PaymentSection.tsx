import { Controller } from "react-hook-form";
import { Form, Radio, InputNumber, Card, Space } from "antd";
import { FaDollarSign, FaCreditCard } from "react-icons/fa";
import { PaymentMethodEnum } from "@/types/order";
import type { Control, FieldErrors } from "react-hook-form";

interface PaymentSectionProps {
  control: Control<any>;
  errors: FieldErrors;
  paymentMethod: PaymentMethodEnum;
}

export function PaymentSection({
  control,
  errors,
  paymentMethod,
}: PaymentSectionProps) {
  return (
    <Card title="Payment Information" style={{ marginBottom: 20 }}>
      <Controller
        name="paymentMethod"
        control={control}
        render={({ field }) => (
          <Form.Item
            label="Payment Method"
            validateStatus={errors.paymentMethod ? "error" : ""}
            help={errors.paymentMethod?.message as string}
          >
            <Radio.Group {...field}>
              <Space direction="vertical">
                <Radio value={PaymentMethodEnum.CASH} className="custom-radio">
                  <Space>
                    <FaDollarSign /> Cash
                  </Space>
                </Radio>
                <Radio value={PaymentMethodEnum.CARD} className="custom-radio">
                  <Space>
                    <FaCreditCard /> Card
                  </Space>
                </Radio>
              </Space>
            </Radio.Group>
          </Form.Item>
        )}
      />

      {paymentMethod === PaymentMethodEnum.CASH && (
        <Controller
          name="cashAmount"
          control={control}
          render={({ field }) => (
            <Form.Item
              label="Cash Amount"
              validateStatus={errors.cashAmount ? "error" : ""}
              help={errors.cashAmount?.message as string}
            >
              <InputNumber
                {...field}
                style={{ width: "100%" }}
                min={0}
                formatter={(value) =>
                  `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) => value?.replace(/\$\s?|(,*)/g, "")}
              />
            </Form.Item>
          )}
        />
      )}
    </Card>
  );
}
