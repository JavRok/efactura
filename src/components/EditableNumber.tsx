import React, { useState, useRef } from "react";
import { useStore } from "@nanostores/react";

import { updateInvoiceField, invoiceStore } from "../stores/invoiceStore";
import type { InvoiceData } from "../stores/invoiceStore";

interface EditableNumberProps {
  initialValue?: number | string;
  placeholder?: string;
  className?: string;
  onChange?: (value: number) => void;
  name: keyof InvoiceData;
  required?: boolean;
  decimals?: number;
  min?: number;
  max?: number;
  // locale?: string;
  symbol?: string;
}

const EditableNumber: React.FC<EditableNumberProps> = ({
  initialValue,
  placeholder = "0",
  className = "",
  onChange,
  name,
  required = false,
  decimals = 2,
  min,
  max,
  // locale = "es-ES",
  symbol,
}) => {
  // Get initial value from props or store
  const $invoice = useStore(invoiceStore);

  // Get the current value from the store
  const storeValue = $invoice[name];
  const numValue =
    storeValue !== undefined
      ? Number(storeValue)
      : initialValue !== undefined
        ? Number(initialValue)
        : 0;

  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Format the number for display
  const getDisplayValue = () => {
    return isNaN(numValue) ? "0" : numValue.toFixed(decimals);
  };

  // Handle focus on the input
  const handleFocus = () => {
    setIsEditing(true);
    setTempValue(numValue.toString());
    if (inputRef.current) {
      inputRef.current.select(); // Select all text for easy replacement
    }
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempValue(e.target.value);
  };

  // Handle blur event (when input loses focus)
  const handleBlur = () => {
    setIsEditing(false);

    // Parse the temporary value
    const newValue = tempValue === "" ? 0 : parseFloat(tempValue);

    // Validate min/max
    let validatedValue = newValue;
    if (min !== undefined && newValue < min) {
      validatedValue = min;
      setError(`El valor no puede ser menos de ${min}`);
      setTimeout(() => {
        setError((err) => (err ? null : err));
      }, 3000);
    } else if (max !== undefined && newValue > max) {
      validatedValue = max;
      setError(`El valor no puede ser mas de ${max}`);
      setTimeout(() => {
        setError((err) => (err ? null : err));
      }, 3000);
    } else {
      setError(null);
    }

    // Update global store
    if (name) {
      updateInvoiceField(name as any, validatedValue.toString());
    }

    if (onChange) {
      onChange(validatedValue);
    }
  };

  // Handle key press in the input
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      inputRef.current?.blur();
    } else if (e.key === "Escape") {
      setIsEditing(false);
      inputRef.current?.blur();
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div className="flex items-center">
        <input
          ref={inputRef}
          type="number"
          value={isEditing ? tempValue : getDisplayValue()}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          step={decimals > 0 ? `0.${"0".repeat(decimals - 1)}1` : "1"}
          min={min}
          max={max}
          placeholder={placeholder.toString()}
          required={required}
          name={name}
          id={`${name}-input`}
          className={`
          w-full px-2 py-1 rounded text-right
          ${
            isEditing
              ? "border border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              : "border-transparent bg-transparent cursor-pointer hover:bg-gray-100"
          }
          ${numValue === 0 && !placeholder ? "text-gray-500 italic" : "text-gray-800"}
          transition-all duration-200
        `}
          aria-invalid={!!error}
        />
        <span>{symbol}</span>
      </div>
      {/* Error message */}
      {error && (
        <div className="absolute whitespace-nowrap bottom-[-1.5rem] left-0 text-xs text-red-500 opacity-100 animate-[fadeOut_3s_ease-in-out_forwards]">
          {error}
        </div>
      )}
    </div>
  );
};

export default EditableNumber;
