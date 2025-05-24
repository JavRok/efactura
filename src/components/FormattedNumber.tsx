import React from "react";
import { useStore } from "@nanostores/react";
import { invoiceStore } from "../stores/invoiceStore";

interface FormattedNumberProps {
  storeField?: string;
  lineIndex?: number;
  lineField?: string;
  className?: string;
  decimals?: number;
  currency?: string;
  locale?: string;
}

const FormattedNumber: React.FC<FormattedNumberProps> = ({
  storeField,
  lineIndex,
  lineField,
  className = "",
  decimals = 2,
  currency,
  locale = "es-ES",
}) => {
  // Subscribe to the store
  const $invoice = useStore(invoiceStore);

  // Get the value based on provided props
  const getValue = (): number => {
    if (
      lineIndex !== undefined &&
      lineField &&
      $invoice.invoiceLines?.[lineIndex]
    ) {
      return $invoice.invoiceLines[lineIndex][lineField] || 0;
    }

    if (storeField && storeField in $invoice) {
      return $invoice[storeField] || 0;
    }

    // Default
    return 0;
  };

  // Format the number with fixed decimals and optional currency
  const formatNumber = (num: number): string => {
    if (currency) {
      return new Intl.NumberFormat(locale, {
        style: "currency",
        currency: currency,
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      }).format(num);
    } else {
      return new Intl.NumberFormat(locale, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      }).format(num);
    }
  };

  const value = getValue();
  const formattedValue = formatNumber(value);

  return (
    <div
      className={`
        w-full px-2 py-1 rounded text-right
        border-transparent bg-transparent
        ${value === 0 ? "text-gray-500 italic" : "text-gray-800"}
        ${className}
      `}
      aria-label={formattedValue}
    >
      {formattedValue}
    </div>
  );
};

export default FormattedNumber;
