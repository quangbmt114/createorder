import { Controller } from "react-hook-form";
import { Form, Input, Card } from "antd";
import type { Control, FieldErrors } from "react-hook-form";
import type { OrderFormData } from "@/types/order";

interface CustomerFormProps {
  control: Control<OrderFormData>;
  errors: FieldErrors<OrderFormData>;
}

export function CustomerForm({ control, errors }: CustomerFormProps) {
  return (
    <Card title="Customer Information" style={{ marginBottom: 20 }}>
      <Controller
        name="customerName"
        control={control}
        render={({ field }) => (
          <Form.Item
            label="Customer Name"
            validateStatus={errors.customerName ? "error" : ""}
            help={errors.customerName?.message as string}
          >
            <Input {...field} placeholder="Enter customer name" />
          </Form.Item>
        )}
      />

      <Controller
        name="customerEmail"
        control={control}
        render={({ field }) => (
          <Form.Item
            label="Customer Email"
            validateStatus={errors.customerEmail ? "error" : ""}
            help={errors.customerEmail?.message as string}
          >
            <Input {...field} placeholder="Enter customer email" />
          </Form.Item>
        )}
      />

      <Controller
        name="customerPhone"
        control={control}
        render={({ field }) => (
          <Form.Item
            label="Customer Phone"
            validateStatus={errors.customerPhone ? "error" : ""}
            help={errors.customerPhone?.message as string}
          >
            <Input {...field} placeholder="Enter customer phone" />
          </Form.Item>
        )}
      />
    </Card>
  );
}
