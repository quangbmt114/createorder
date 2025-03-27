"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import "@ant-design/v5-patch-for-react-19";

const CreateOrderForm = dynamic(
  () => import("@/components/create-order/CreateOrderForm"),
  {
    ssr: false,
  }
);

export default function OrderPage() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 overflow-x-hidden">
      <CreateOrderForm />
    </div>
  );
}
