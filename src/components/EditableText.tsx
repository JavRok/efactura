import React, { useState, useRef } from "react";
import { updateInvoiceField, getInvoiceField } from "../stores/invoiceStore";
import type { InvoiceData } from "../stores/invoiceStore";

interface EditableTextProps {
  initialText?: string;
  placeholder?: string;
  className?: string;
  onTextChange?: (text: string) => void;
  name: keyof InvoiceData;
  required?: boolean;
  maxLength?: number;
}

const EditableText: React.FC<EditableTextProps> = ({
  initialText = "",
  placeholder = "Click para editar",
  className = "",
  onTextChange,
  name,
  required = false,
  maxLength,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(initialText || getInvoiceField(name) || "");
  const [error, setError] = useState<string | null>(null);
  const textRef = useRef<HTMLDivElement>(null);

  const handleFocus = (e: React.FocusEvent<HTMLDivElement>) => {
    // Only on client
    if (typeof window === "undefined") {
      return;
    }
    setIsEditing(true);

    // set cursor at the end
    const selection = window.getSelection();
    if (selection && textRef.current) {
      // First set the selection at the beginning
      selection.collapse(textRef.current, 0);
      // Then move it to the end
      selection.modify("move", "forward", "documentboundary");
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    const newText = e.currentTarget.textContent || "";
    setIsEditing(false);

    // Validate on blur
    if (required && !newText) {
      setError("This field is required");
    } else {
      setError(null);
    }

    // Update global store
    if (name) {
      updateInvoiceField(name as any, newText);
    }

    if (onTextChange) {
      onTextChange(newText);
    }

    setText(newText);
  };

  return (
    <div className="group relative hover:bg-gray-100 cursor-pointer">
      {/* Hidden input for form submission */}
      <input
        type="hidden"
        name={name}
        id={name}
        value={text}
        required={required}
        maxLength={maxLength}
        readOnly
        // hidden
      />

      <div
        ref={textRef}
        contentEditable="plaintext-only"
        onBlur={handleBlur}
        // onInput={handleInput}
        // onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        className={`
          rounded transition-all duration-200
          ${text ? "text-gray-800" : "text-gray-500 italic"}
          ${className}
        `}
        suppressContentEditableWarning={true}
        aria-required={required}
        aria-invalid={!!error}
      >
        {text || (isEditing ? "" : placeholder)}
      </div>

      {error && (
        <div className="absolute bottom-[-2rem] left-0 text-xs text-red-500">
          {error}
        </div>
      )}
    </div>
  );
};

export default EditableText;
